const axios = require("axios");
const { performance } = require("perf_hooks");

async function fetch(url, data) {
  try {
    const response = await axios.post(url, data);
    return { status: response.status, data: response.data };
  } catch (error) {
    return { status: null, error: error.message };
  }
}

async function main(url, numRequests, data) {
  const requests = [];

  // Mulai pengukuran waktu
  const startTime = performance.now();

  for (let i = 0; i < numRequests; i++) {
    requests.push(fetch(url, data));
  }

  await Promise.all(requests);

  const endTime = performance.now();
  // Hitung dan tampilkan waktu total dalam detik
  const totalTime = (endTime - startTime) / 1000; // Konversi milidetik ke detik
  console.log(`Total time taken: ${totalTime.toFixed(4)} seconds`);
}

const targetUrl = "http://localhost:3100/posisi/predict2"; // Ganti dengan URL lokal server Anda
const numberOfRequests = 100; // Jumlah request yang ingin dikirimkan
const bodyData = {
  lat_naik: -6.9201824,
  lon_naik: 107.6216454,
  jurusan: "Cibiru - Leuwipanjang",
};

main(targetUrl, numberOfRequests, bodyData);
