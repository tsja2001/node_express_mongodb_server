const chalk = require("chalk");

// 下载
const download = require("download-git-repo");
// 加载提示
const ora = require("ora");

const downloadFn = (url, project) => {
	const spinner = ora();
	spinner.text = "下载中";
	spinner.start();
	// 克隆github 方法: download(url, project, (err) => {})
	// 克隆gitlab 方法: download(url, project, {clone: true}, (err) => {})
	// 需要自定义参数

	let props = [];
	const ifGitHub = url.split("tsja2001");
	if (ifGitHub.length > 1) {
		props = [url, project];
	} else {
		props = [url, project, {clone: true}];
	}

	download(...props, (err) => {
		console.log(url);
		// download("tsja2001/tsja_cli_node_express_repository", "project", (err) => {
		// download("tsja2001/tsja_cli_node_express_repository", "project", (err) => {
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
