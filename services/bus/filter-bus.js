const pool = require("../../utils/db-pool");

module.exports = (httpRequest, httpResponse) => {
  const jurusan = httpRequest.query.jurusan;
  if (jurusan !== null) {
    pool.query(
      `
        SELECT app.bus.jurusan, app.jadwal.jam, app.jadwal.kursi_kosong, app.bus.tarif FROM app.bus 
        INNER JOIN app.jadwal ON app.bus.no_bus = app.jadwal.no_bus 
        WHERE app.bus.kode_jurusan = $1
    `,
      [jurusan],
      (dbError, dbResponse) => {
        if (dbError) throw dbError;
        httpResponse.json(dbResponse.rows);
      }
    );
  } else {
    pool.query(
      `
        SELECT * FROM app.bus
    `,
      [],
      (dbError, dbResponse) => {
        if (dbError) throw dbError;
        httpResponse.json(dbResponse.rows);
      }
    );
  }
};
