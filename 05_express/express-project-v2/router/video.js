const express = require("express");
const videoController = require("../controller/userController");

const router = express.Router();

router
	.get("/list", videoController.list)
	.delete("/delete", videoController.delete);

// router.get("/users", (req, res, next) => {
// 	console.log(req.method);
// 	res.send("users");
// });

module.exports = router;
