const express = require("express");
const app = express();
const db = require("./db");
// 使服务端能够收到客户端发来的
// application/x-www-form-urlencoded和json类型数据
// app.use(express.urlencoded());
app.use(express.json());

// 取用户列表
app.get("/", async function (req, res) {
	// 需求, 客户端请求时, 返回db.json中的用户数据
	try {
		const jsonObj = await db.getDb();
		console.log(jsonObj);
		res.send(jsonObj.users);
	} catch (err) {
		res.status(500).json({err});
	}
});

// 新建用户
app.post("/", async function (req, res) {
	let body = req.body;
	if (!body) {
		res.status(403).json({error: "缺少用户信息"});
	} else {
		const back = await db.getDb();

		body.id = back.users[back.users.length - 1].id + 1;

		back.users.push(body);

		try {
			let w = await db.writeDb(back);
			if (!w) {
				res.status(200).send({
					msg: "添加成功",
				});
			}
		} catch (err) {
			res.status(500).json({err});
		}
	}
});

// 编辑用户
app.put("/:id", async (req, res) => {
	const id = req.params.id;
	const body = req.body;
	try {
		if (!body) {
			res.status(403).json({error: "缺少用户信息"});
		}
		const userinfo = await db.getDb();

		// 先判断数据库中是否有此id
		const currentUser = userinfo.users.find((item) => item.id == id);
		if (!currentUser) {
			res.status(403).json({error: "用户不存在"});
		}

		// 修改用户
		currentUser.username = body.username ?? currentUser.username;
		currentUser.age = body.age ?? currentUser.age;

		let w = await db.writeDb(userinfo);
		if (!w) {
			res.status(201).send({
				msg: "修改成功",
			});
		}
	} catch (err) {
		res.status(500).json({err});
	}
});

app.listen(3000, () => {
	console.log("run http://127.0.0.1:3000");
});
