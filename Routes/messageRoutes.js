const express = require("express");
const { getMessage } = require("../Controllers/MessageControllers/MessageController")

const router = express.Router();

router.get("/", getMessage);

module.exports = router;