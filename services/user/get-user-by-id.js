const pool = require("../../utils/db-pool");

module.exports = (httpRequest, httpResponse) => {
  const user = httpRequest.body.user;
  pool.query(
    `
      SELECT * FROM app.user WHERE id_user = $1
    `,
    [user],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      httpResponse.json(dbResponse.rows);
    }
  );
};
