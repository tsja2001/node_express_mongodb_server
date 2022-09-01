const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

const validator = require("../middleware/validator/userValidator");

router
	.post("/registers", validator.register, userController.register)
	.get("/lists", userController.list)
	.delete("/", userController.delete);

module.exports = router;
