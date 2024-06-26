const pool = require("../../utils/db-pool");

module.exports = (httpRequest, httpResponse) => {
  console.log("request body: ", httpRequest.body);
  pool.query(
    `
        INSERT INTO app.pesanan( 
          id_penumpang, 
          id_jadwal, 
          tanggal, 
          nama, 
          kontak, 
          jumlah_kursi, 
          lat_naik, 
          lon_naik, 
          tarif
        ) 
        VALUES (
          $1, 
          $2, 
          $3, 
          $4, 
          $5, 
          $6, 
          $7, 
          $8, 
          $9
        );
    `,
    [
      httpRequest.body.id_user,
      httpRequest.body.id_jadwal,
      httpRequest.body.tanggal,
      httpRequest.body.nama,
      httpRequest.body.kontak,
      httpRequest.body.jumlah_kursi,
      httpRequest.body.lat_naik,
      httpRequest.body.lon_naik,
      httpRequest.body.tarif,
    ],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      httpResponse.json(dbResponse.rows);
      console.log(dbResponse);
    }
  );
};
