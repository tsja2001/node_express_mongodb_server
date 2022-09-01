const express = require("express");
const router = require("./router/index");
const router_video = require("./router/video");
const app = express();

// 如果想请求/index, 需要输入路径/user/index
app.use("/user", router);
app.use("/video", router_video);

// 以上路由都无法匹配, 则返回404数据
app.use((req, res, next) => {
	res.status(404).send("404 not found");
});

// 当app.use()传入四个参数时, 默认为服务器错误处理中间件
// 其中第一个参数为err
app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send("servers error");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
