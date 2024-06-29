const pool = require("../../utils/db-pool");
const mqtt = require("mqtt");
const protocol = "mqtt";
const host = "135.181.26.148";
const port = "1885";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `${protocol}://${host}:${port}`;

const nobus = "D1234HH";

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: "emqx",
  password: "public",
  reconnectPeriod: 1000,
});

client.on("connect", () => {
  console.log("Connected");
});

const topic = "publish/gps";

client.on("connect", () => {
  console.log("Connected");
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
});

// menambahkan data posisi baru ke database
client.on("message", (topic, payload) => {
  console.log("Received Message:", topic, payload.toString());
  const jsonString = payload.toString();
  const data = JSON.parse(jsonString);
  const latitude = data.latitude;
  const longitude = data.longitude;
  const dayNum = new Date().getDay();
  const time = new Date().toLocaleTimeString();
  console.log(time);
  var day = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][
    dayNum
  ];

  pool.query(
    `
      INSERT INTO app.posisi(
        no_bus,
        lat,
        lng,
        day,
        time)
  VALUES ($1, $2, $3, $4, $5);
    `,
    [nobus, latitude, longitude, day, time],
    (dbError, dbResponse) => {
      if (dbError) throw dbError;
      //httpResponse.json();
      console.log(dbResponse.rows);
    }
  );
});

module.exports = (httpRequest, httpResponse) => {};
