const pool = require("../../utils/db-pool");

module.exports = (httpRequest, httpResponse) => {
  const bus = httpRequest.body.bus;
  pool.query(
    `
      SELECT lat_awal, lon_awal, lat_akhir, lon_akhir FROM app.bus WHERE no_bus = $1
    `,
    [bus],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      httpResponse.json(dbResponse.rows);
    }
  );
};
