const bcrypt = require("bcryptjs");
const pool = require("../../utils/db-pool");

module.exports = (httpRequest, httpResponse) => {
  const hashedPassword = bcrypt.hashSync(httpRequest.body.pass, 8);
  pool.query(
    `
        UPDATE app.user SET
            nama = $1,
            kontak = $2,
            pass = $3
        WHERE id_user = $4
    `,
    [
      httpRequest.body.nama,
      httpRequest.body.kontak,
      hashedPassword,
      httpRequest.body.id_user,
    ],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      httpResponse.json(dbResponse.rows);
    }
  );
};
