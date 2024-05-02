const express = require("express");
const router = express.Router();

const getUser = require("../services/user/get-user");
router.get("/", getUser);

const postUser = require("../services/user/post-user");
router.post("/", postUser);

const updateUser = require("../services/user/update-user");
router.post("/update", updateUser);

module.exports = router;
