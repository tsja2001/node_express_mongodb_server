// 引入数据库集合
const {User} = require("../model");
exports.register = async (req, res, next) => {
	console.log(req.body);

	// return;
	const userModel = new User(req.body);

	const dbBack = await userModel.save();

	res.json(dbBack);
};
exports.list = async (req, res, next) => {
	console.log(req.method);
	res.send("/user-list");
};

exports.delete = async (req, res, next) => {
	console.log(req.method);
	res.send("/user-list");
};
