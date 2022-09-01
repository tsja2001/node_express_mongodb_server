const express = require("express");

const cors = require("cors");
const morgan = require("morgan");

const router = require("./router");

const app = express();

// 使服务器能够解析请求body中的x-www-form-urlencoded和json格式
app.use(express.json());
app.use(express.urlencoded());

// 实现支持跨域请求
app.use(cors());
// 实现日志记录
app.use(morgan("dev"));

// 实现路由
app.use("/api/v1", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
