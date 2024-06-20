const pool = require("../../utils/db-pool");

module.exports = (httpRequest, httpResponse) => {
  const now = new Date();
  const last5Minutes = new Date(now.getTime() - 5 * 60000); // 5 * 60000 adalah 5 menit dalam milidetik

  // Mendapatkan bagian waktu (jam, menit, dan detik) dari objek Date
  const hours = last5Minutes.getHours();
  const minutes = last5Minutes.getMinutes();
  const seconds = last5Minutes.getSeconds();

  // Format waktu menjadi string yang sesuai dengan format yang dibutuhkan di SQL
  const timeString = `${hours}:${minutes}:${seconds}`;
  const hitungKecepatan = (data) => {
    if (data.length < 2) {
      throw new Error("Data harus berisi setidaknya dua titik.");
    }

    let totalJarak = 0;
    let totalWaktu = 0;

    for (let i = 1; i < data.length; i++) {
      const lat1 = data[i - 1]["lat"];
      const lon1 = data[i - 1]["lng"];
      const lat2 = data[i]["lat"];
      const lon2 = data[i]["lng"];

      const delta_lat = toRadians(lat2 - lat1);
      const delta_lon = toRadians(lon2 - lon1);

      const a =
        Math.pow(Math.sin(delta_lat / 2), 2) +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.pow(Math.sin(delta_lon / 2), 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const jarak = 6371 * c; // Radius Bumi dalam kilometer

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

  const toSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const toRadians = (degree) => {
    return degree * (Math.PI / 180);
  };

  const data = [
    { lat: "-6.9340079", lng: "107.7281035", time: "22:37:09" },
    { lat: "-6.9340079", lng: "107.7281035", time: "22:38:42" },
    { lat: "-6.9340079", lng: "107.7281035", time: "22:38:43" },
    { lat: "-6.9340079", lng: "107.7281035", time: "22:43:16" },
    { lat: "-6.9340079", lng: "107.7281035", time: "22:43:19" },
    { lat: "-6.9340079", lng: "107.7281035", time: "22:43:25" },
  ];

  console.log("kecepatan: ", hitungKecepatan(data));

  pool.query(
    `
        SELECT lat, lng, time FROM app.posisi WHERE time >= $1;
    `,
    [timeString],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      httpResponse.json(dbResponse.rows);
    }
  );
};
