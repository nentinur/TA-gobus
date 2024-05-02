const pool = require("../../utils/db-pool");
const bcrypt = require("bcryptjs");

module.exports = (httpRequest, httpResponse) => {
  const kontak = httpRequest.body.kontak;
  const pass = httpRequest.body.pass;

  pool.query(
    `
        SELECT * FROM app.user WHERE kontak = $1;
    `,
    [kontak],
    (dbError, dbResponse) => {
      console.log(dbResponse);
      if (dbError) throw dbError;

      if (dbResponse.rowCount > 0) {
        const hasil = bcrypt.compareSync(pass, dbResponse.rows[0].pass);
        if (hasil) {
          httpResponse.json(dbResponse.rows[0]);
        } else {
          httpResponse
            .status(400)
            .json({ message: "username atau password salah" });
        }
      }
    }
  );
};
