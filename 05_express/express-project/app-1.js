const express = require("express");
const router = require("./router/index");
const router_video = require("./router/video");
const app = express();

app.all("/xx", (req, res) => {
	res.send("xxxxxx");
});

// 请求路径携带参数
app.get("/user/:id/video/:vid", (req, res) => {
	// 如果请求 /user/10/video/100
	// 则打印 { id: '10', vid: '100' }
	console.log(req.params);
	res.send("");
});

// 链式调用(router也可以链式调用)
app
	.post("/wuhu", (req, res) => {
		res.send("wuhu");
	})
	.get("/yahaha", (req, res) => {
		res.send("yahaha");
	});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
