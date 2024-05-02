const express = require("express");
const router = express.Router();

const getBus = require("../services/bus/get-bus");
router.get("/", getBus);

const updateBus = require("../services/bus/update-bus");
router.post("/update", updateBus);

const getBusJadwal = require("../services/bus/get-bus-by-jadwal");
router.get("/jadwal", getBusJadwal);

module.exports = router;
