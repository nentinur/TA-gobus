const bcrypt = require("bcryptjs");
const pool = require("../../utils/db-pool");

module.exports = (httpRequest, httpResponse) => {
  pool.query(
    `
        UPDATE app.posisi SET 
            lat = $1, 
            lng = $2
	    WHERE no_bus = $3;
    `,
    [
      httpRequest.body.latitude,
      httpRequest.body.longitude,
      httpRequest.body.id,
    ],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      httpResponse.json(dbResponse.rows);
    }
  );
};
