const pool = require("../../utils/db-pool");

module.exports = (httpRequest, httpResponse) => {
  pool.query(
    `
        UPDATE app.jadwal SET 
            kursi_kosong = $1
	    WHERE id_jadwal = $2;
    `,
    [httpRequest.body.kursi, httpRequest.body.id],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      httpResponse.json(dbResponse.rows);
    }
  );
};
