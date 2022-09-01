const fs = require("fs");
const url = require("url");
const controller = require("./controller");

module.exports = (request, response) => {
	const method = request.method;
	if (method === "GET") {
		// 请求头传参
		console.log(url.parse(request.url, true));
		if (request.url == "/") {
			controller.index(response);
		} else {
			fs.readFile("./img.png", (err, data) => {
				response.end(data);
			});
		}
	} else if (method == "POST") {
		var data = "";
		request.on("data", function (d) {
			data += d; // 获取客户端发送流数据
		});
		// 客户端数据发送完毕, 解析客户端的数据
		request.on("end", function () {
			// 请求体传参
			controller.user(require("querystring").parse(data), response);
			// console.log(require("querystring").parse(data));
		});

		response.end();
	}
};
