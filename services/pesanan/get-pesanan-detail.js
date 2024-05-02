const pool = require("../../utils/db-pool");

module.exports = (httpRequest, httpResponse) => {
  const id_pesanan = httpRequest.query.id_pesanan;
  pool.query(
    `
        SELECT to_char(app.pesanan.tanggal,'DD-MM-YYYY'), * FROM app.pesanan 
        JOIN app.jadwal ON app.pesanan.id_jadwal = app.jadwal.id_jadwal 
        JOIN app.bus ON app.jadwal.no_bus = app.bus.no_bus 
        WHERE id_pesanan = $1
    `,
    [id_pesanan],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      httpResponse.json(dbResponse.rows[0]);
    }
  );
};
