const express = require("express");
const router = express.Router();

const getPosisi = require("../services/posisi/get-posisi");
router.get("/", getPosisi);

const getKecepatan = require("../services/posisi/kecepatan");
router.get("/kecepatan", getKecepatan);

const deletePosisi = require("../services/posisi/delete-posisi");
router.delete("/", deletePosisi);

const getRute = require("../services/posisi/get-rute");
router.post("/rute", getRute);

const estimate = require("../services/posisi/estimate");
router.get("/predict", estimate);

module.exports = router;
