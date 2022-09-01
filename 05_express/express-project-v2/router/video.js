const express = require("express");
const videoController = require("../controller/userController");

const router = express.Router();

router.get("/lists", videoController.list);

module.exports = router;
