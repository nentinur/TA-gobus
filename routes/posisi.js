const express = require("express");
const router = express.Router();

const getPosisi = require("../services/posisi/get-posisi");
router.get("/", getPosisi);

const deletePosisi = require("../services/posisi/delete-posisi");
router.delete("/", deletePosisi);

const getRute = require("../services/posisi/get-rute");
router.post("/rute", getRute);

const estimate = require("../services/posisi/estimate");
router.post("/predict", estimate);

module.exports = router;
