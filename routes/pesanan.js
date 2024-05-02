const express = require("express");
const router = express.Router();

const getPesanan = require("../services/pesanan/get-pesanan");
router.get("/", getPesanan);

const postPesanan = require("../services/pesanan/post-pesanan");
router.post("/", postPesanan);

const getPesananByUser = require("../services/pesanan/get-pesanan-by-user");
router.get("/pesanan-user", getPesananByUser);

const getPesananDetail = require("../services/pesanan/get-pesanan-detail");
router.get("/pesanan-detail", getPesananDetail);

const getPesananJadwal = require("../services/pesanan/get-pesanan-by-jadwal");
router.get("/pesanan-jadwal", getPesananJadwal);

module.exports = router;
