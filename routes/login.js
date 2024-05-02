const express = require("express");
const router = express.Router();

const login = require("../services/login/login");
router.post("/", login);

module.exports = router;
