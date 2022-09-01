// 引入数据库集合
const {User} = require("../model");
exports.register = async (req, res, next) => {
	const userModel = new User(req.body);

	const dbBack = await userModel.save();

	const user = dbBack.toJSON();
	delete user.password;

	res.status(201).json({user});
};
exports.list = async (req, res, next) => {
	console.log(req.method);
	res.send("/user-list");
};

exports.delete = async (req, res, next) => {
	console.log(req.method);
	res.send("/user-list");
};
