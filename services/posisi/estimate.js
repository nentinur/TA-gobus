const ort = require("onnxruntime-node");
const pool = require("../../utils/db-pool");
const fs = require("fs");
const csv = require("csv-parser");
const geolib = require("geolib");
const modelPath = "file/knn_model.onnx";
const dataHambatan = "file/hambatan.csv";
const dataRute = "file/rute.csv";
module.exports = async (httpRequest, httpResponse) => {
  try {
    async function predict(jarak, kecepatan, hambatan) {
      try {
        const session = await ort.InferenceSession.create(modelPath);
        const inputName = session.inputNames[0];

        const inputData = [jarak, kecepatan, hambatan];
        const inputTensor = new ort.Tensor(
          "float32",
          new Float32Array(inputData),
          [1, inputData.length]
        );
        const feeds = { [inputName]: inputTensor };
        const outputMap = await session.run(feeds);
        const outputName = session.outputNames[0];
        const prediction = outputMap[outputName].data;
        const integerPart = Math.floor(prediction);
        const microsecondPart = Math.floor((prediction - integerPart) * 1e6);
        const epoch = new Date("2024-01-01T00:00:00Z");
        epoch.setSeconds(epoch.getSeconds() + integerPart);
        epoch.setMilliseconds(
          epoch.getMilliseconds() + Math.floor(microsecondPart / 1000)
        );
        const waktu = epoch.toISOString().substr(11, 8);
        return waktu;
      } catch (error) {
        console.error("Error during inference:", error);
        throw error;
      }
    }
    const toSeconds = (timeString) => {
      const [hours, minutes, seconds] = timeString.split(":").map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    };

    const hitungKecepatan = (data) => {
      if (data.length < 2) {
        throw new Error("Data harus berisi setidaknya dua titik.");
      }

      let totalJarak = 0;
      let totalWaktu = 0;

      for (let i = 1; i < data.length; i++) {
        const jarakM = geolib.getDistance(
          { latitude: data[i - 1]["lat"], longitude: data[i - 1]["lng"] },
          { latitude: data[i]["lat"], longitude: data[i]["lng"] }
        );
        const jarak = jarakM / 1000;

        // Konversi waktu dari format HH:MM:SS ke detik
        const waktu1 = toSeconds(data[i - 1]["time"]);
        const waktu2 = toSeconds(data[i]["time"]);
        const waktu = (waktu2 - waktu1) / 3600; // Konversi ke jam

        if (isNaN(jarak) || isNaN(waktu) || waktu <= 0) {
          console.error(
            `Kesalahan pada segmen ${i}: Jarak atau waktu tidak valid`
          );
          continue; // Abaikan segmen dengan data tidak valid
        }

        totalJarak += jarak;
        totalWaktu += waktu;
      }

      if (totalWaktu === 0) {
        throw new Error("Total waktu tidak valid (nol atau negatif).");
      }

      const kecepatanRataRata = totalJarak / totalWaktu;
      return kecepatanRataRata;
    };
    // Mencari indeks titik terdekat dari suatu titik dalam rute
    const nearestPoint = (point, route) => {
      let minDistance = Infinity;
      let nearestIndex = null;

      route.forEach((p, i) => {
        const distance = Math.sqrt(
          Math.pow(point[0] - p.lat, 2) + Math.pow(point[1] - p.lng, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = i;
        }
      });

      return nearestIndex;
    };

    // Menghitung jarak total antara dua titik pada rute
    const jarakTotal = (route, startIdx, endIdx) => {
      // Inisialisasi totalDistance dengan 0
      let totalDistance = 0;

      // Validasi panjang array dan indeks
      if (startIdx >= endIdx || startIdx < 0 || endIdx >= route.length) {
        console.error("Invalid indices:", { startIdx, endIdx });
        return NaN;
      }

      for (let i = startIdx; i < endIdx; i++) {
        if (route[i] && route[i + 1]) {
          // Pastikan route[i] dan route[i + 1] ada
          const distance = geolib.getDistance(
            { latitude: route[i].lat, longitude: route[i].lng },
            { latitude: route[i + 1].lat, longitude: route[i + 1].lng }
          );

          totalDistance += distance;
        } else {
          console.error("Invalid route points at index:", i);
          return NaN;
        }
      }

      return totalDistance / 1000; // Konversi ke kilometer
    };

    function hitungHambatan(titik1, titik2, dataHambatan) {
      return new Promise((resolve, reject) => {
        let hambatanSkor = 0;
        let hambatanCount = 0;

        fs.createReadStream(dataHambatan)
          .pipe(csv())
          .on("data", (row) => {
            const latitude = parseFloat(row.latitude);
            const longitude = parseFloat(row.longitude);
            const skorHambatan = parseFloat(row.skor_hambatan);

            if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(skorHambatan)) {
              const distanceToLine = geolib.getDistanceFromLine(
                { latitude, longitude },
                { latitude: titik1[0], longitude: titik1[1] },
                { latitude: titik2[0], longitude: titik2[1] }
              );

              if (distanceToLine <= 550) {
                // radius dalam meter
                hambatanSkor += skorHambatan;
                hambatanCount += 1;
              }
            }
          })
          .on("end", () => {
            resolve(hambatanSkor);
          })
          .on("error", (err) => {
            reject(err);
          });
      });
    }

    const route = [];
    let hambatan;
    let kecepatan;
    let jarak;
    const latNaik = httpRequest.body.lat_naik;
    const lonNaik = httpRequest.body.lon_naik;
    // Contoh penggunaan fungsi
    const naik = [latNaik, lonNaik];
    let bus;

    // Query database
    const dbResponse = await new Promise((resolve, reject) => {
      pool.query(
        `
                SELECT * FROM (
                     SELECT * FROM app.posisi
                     ORDER BY created_at DESC
                     LIMIT 10
                 ) sub
                ORDER BY created_at ASC;
            `,
        [],
        (dbError, dbResponse) => {
          if (dbError) reject(dbError);
          else resolve(dbResponse);
        }
      );
    });
    kecepatan = hitungKecepatan(dbResponse.rows);
    const posisiBus = await new Promise((resolve, reject) => {
      pool.query(
        `
                SELECT lat, lng FROM app.posisi ORDER BY created_at DESC LIMIT 1
            `,
        [],
        (dbError, dbResponse) => {
          if (dbError) reject(dbError);
          else resolve(dbResponse.rows);
        }
      );
    });
    bus = [posisiBus[0].lat, posisiBus[0].lng];
    console.log(naik);
    console.log(bus);

    // Hitung kecepatan

    // Baca CSV dan proses jarak
    await new Promise((resolve, reject) => {
      fs.createReadStream(dataRute)
        .pipe(csv())
        .on("data", (row) => {
          route.push({
            lat: parseFloat(row.lat),
            lng: parseFloat(row.lng),
          });
        })
        .on("end", () => {
          let titik1Index;
          let titik2Index;
          if (httpRequest.body.jurusan == "Cibiru - Leuwipanjang") {
            titik1Index = nearestPoint(bus, route);
            titik2Index = nearestPoint(naik, route);
          } else if (httpRequest.body.jurusan == "Leuwipanjang - Cibiru") {
            titik1Index = nearestPoint(naik, route);
            titik2Index = nearestPoint(bus, route);
          }
          jarak = jarakTotal(route, titik1Index, titik2Index);
          resolve();
        })
        .on("error", (err) => {
          reject(err);
        });
    });

    if (httpRequest.body.jurusan == "Cibiru - Leuwipanjang") {
      hambatan = await hitungHambatan(bus, naik, dataHambatan);
    } else if (httpRequest.body.jurusan == "Leuwipanjang - Cibiru") {
      hambatan = await hitungHambatan(naik, bus, dataHambatan);
    }

    // Pengecekan validitas variabel sebelum menjalankan prediksi
    if (
      typeof hambatan === "number" &&
      Number.isFinite(jarak) &&
      Number.isFinite(kecepatan)
    ) {
      try {
        const result = await predict(jarak, kecepatan, hambatan);
        httpResponse.json({
          result: result,
          kecepatan: kecepatan,
          jarak: jarak,
          hambatan: hambatan,
        });
        console.log("jarak bus: ", jarak);
        console.log("kecepatan bus: ", kecepatan);
        console.log("hambatan: ", hambatan);
        console.log("estimasi waktu: ", result);
      } catch (error) {
        httpResponse.status(500).send("Error during prediction");
        console.error("Error during prediction:", error);
      }
    } else {
      httpResponse.status(400).send("ada yang salah");
    }

    // Respon
  } catch (error) {
    httpResponse.status(500).send("Error during prediction");
    console.log(error);
  }
};
