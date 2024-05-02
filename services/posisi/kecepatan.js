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
    let kecepatan = 0;
    for (let i = 1; i < data.lengths; i++) {
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

      const waktu = data[i]["waktu (detik)"] / 3600;

      kecepatan = jarak / waktu;

      return kecepatan;
    }
  };
  pool.query(
    `
        SELECT lat, lng, time FROM app.posisi WHERE time >= $1;
    `,
    [timeString],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      httpResponse.json(dbResponse.rows);
      hitungKecepatan(dbResponse);
    }
  );
};
