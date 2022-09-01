const fs = require("fs");
// 针对不同请求, 做出对应的处理

module.exports = {
	// 首页请求
	index(response) {
		fs.readFile("./index.html", "utf-8", (err, data) => {
			response.end(data);
		});
	},
	// post表单
	user(postData, res) {
		console.log("post数据:");
		console.log(postData);
	},
};
