const pool = require("../../utils/db-pool");

module.exports = (httpRequest, httpResponse) => {
  const id_user = httpRequest.query.id_user;
  pool.query(
    `
        SELECT * FROM app.user WHERE id_user = $1
    `,
    [id_user],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      httpResponse.json(dbResponse.rows[0]);
    }
  );
};
