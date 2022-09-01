const express = require("express");

const router = express.Router();

router.get("/list", (req, res, next) => {
	console.log(req.method);
	res.send("/viedo/list");
});

// router.get("/users", (req, res, next) => {
// 	console.log(req.method);
// 	res.send("users");
// });

module.exports = router;
