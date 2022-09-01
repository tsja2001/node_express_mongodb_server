const chalk = require("chalk");

// 下载
const download = require("download-git-repo");
// 加载提示
const ora = require("ora");

const downloadFn = (url, project) => {
	const spinner = ora();
	spinner.text = "下载中";
	spinner.start();
	download("direct:" + url, project, {clone: true}, (err) => {
		if (!err) {
			spinner.stop();
			console.log(chalk.blue.bold("\n下载成功!"));
			console.log(chalk.bold("run:"));
			console.log(chalk.green("cd " + project));
			console.log(chalk.green("npm install"));
			console.log(chalk.green("npm run dev"));
		} else {
			spinner.fail("下载失败");
		}
	});
};

module.exports = downloadFn;
