const pool = require("../../utils/db-pool");

module.exports = (httpRequest, httpResponse) => {
  const id_user = httpRequest.query.id_user;
  pool.query(
    `
        SELECT app.pesanan.id_pesanan, app.jadwal.id_jadwal, app.bus.jurusan, app.jadwal.jam, to_char(app.pesanan.tanggal,'DD-MM-YYYY') FROM app.pesanan 
        JOIN app.jadwal ON app.pesanan.id_jadwal = app.jadwal.id_jadwal 
        JOIN app.bus ON app.jadwal.no_bus = app.bus.no_bus 
        WHERE id_penumpang = $1
    `,
    [id_user],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      httpResponse.json(dbResponse.rows);
    }
  );
};
