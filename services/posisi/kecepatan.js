const pool = require("../../utils/db-pool");

module.exports = (httpRequest, httpResponse) => {
  const fs = require("fs");
  const csv = require("csv-parser");
  const geolib = require("geolib");

  // Fungsi untuk menghitung jumlah hambatan dan skor hambatan
  function hitungHambatan(titik1, titik2, csvFilePath) {
    const bufferedPoints = [];
    let hambatanSkor = 0;
    let hambatanCount = 0;

    fs.createReadStream(csvFilePath)
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
        console.log("Jumlah Hambatan:", hambatanCount);
        console.log("Skor Hambatan:", hambatanSkor);
      })
      .on("error", (err) => {
        console.error("Error saat membaca file CSV:", err);
      });
  }

  // Contoh penggunaan fungsi
  const titik1 = [-6.904757, 107.6773];
  const titik2 = [-6.904199, 107.667625];

  const csvFilePath = "model/hambatan.csv";

  hitungHambatan(titik1, titik2, csvFilePath);

  pool.query(
    `
        SELECT * FROM (
            SELECT lat, lng, time FROM app.posisi
            ORDER BY time DESC
            LIMIT 10
        ) sub
        ORDER BY time ASC;

    `,
    [],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      httpResponse.json(dbResponse.rows);
    }
  );
};
