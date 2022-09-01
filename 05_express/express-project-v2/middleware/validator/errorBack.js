const {validationResult} = require("express-validator");

// 传入验证方式, 用来验证请求体格式
module.exports = (validator) => {
	return async (req, res, next) => {
		// 对请求体验证
		await Promise.all(validator.map((validate) => validate.run(req)));
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(401).json({error: error.array()});
		}
		next();
	};
};
