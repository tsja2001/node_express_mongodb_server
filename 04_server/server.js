const http = require("http");
const routes = require("./router");
// 1. 创建服务器
const server = http.createServer();
server.listen(8080, () => {
	console.log("http://127.0.0.1:8080");
});

// 监听客户端请求
server.on("request", (request, response) => {
	// 将所有请求, 都交给router模块处理
	routes(request, response);
});
