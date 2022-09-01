// 用于做用户部分, 请求的数据验证
const {body, validationResult} = require("express-validator");
const validate = require("./errorBack");
module.exports.register = validate([
	body("username")
		.notEmpty()
		.withMessage("用户名不能为为空")
		.bail() // .bail()如果前面验证失败, 则不进行后续验证
		.isLength({min: 3})
		.withMessage("用户名长度不能小于3"),
	body("email").notEmpty().withMessage("邮箱不能为为空").isEmail(),
	body("password").isLength({min: 5}).withMessage("密码至少5位"),
]);
