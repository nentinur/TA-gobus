const bcrypt = require("bcryptjs");
const pool = require("../../utils/db-pool");

module.exports = (httpRequest, httpResponse) => {
  const hashedPassword = bcrypt.hashSync(httpRequest.body.pass, 8);
  pool.query(
    `
        INSERT INTO app.user (
            nama,
            kontak,
            pass,
            role
        )
        VALUES (
            $1,
            $2,
            $3,
            'penumpang'
        )
    `,
    [httpRequest.body.nama, httpRequest.body.kontak, hashedPassword],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      httpResponse.json(dbResponse.rows);
    }
  );
};
