var inquirer = require("inquirer");
var config = require("../../config.js");
const downloadFn = require("./download.js");

const myAction = async (project, args) => {
	// 命令行的执行逻辑代码
	const answer = await inquirer.prompt([
		{
			type: "list",
			name: "framwork",
			choices: config.framwork,
			message: "请选择你所使用的框架",
		},
	]);

	// 下载代码模板
	downloadFn(config.foramworkUrl[answer.framwork], project);
};

module.exports = myAction;
