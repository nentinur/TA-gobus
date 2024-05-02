const pool = require("../../utils/db-pool");

module.exports = (httpRequest, httpResponse) => {
  const id_jadwal = httpRequest.query.id_jadwal;
  pool.query(
    `
        SELECT * FROM app.bus 
        JOIN app.jadwal ON app.bus.no_bus = app.jadwal.no_bus
        WHERE app.jadwal.id_jadwal = $1
    `,
    [id_jadwal],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      httpResponse.json(dbResponse.rows[0]);
    }
  );
};
