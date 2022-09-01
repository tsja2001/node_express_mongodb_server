const {promisify} = require("util");
const fs = require("fs");

// 讲fs.readFile和writeFile包裹成promise形式
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

exports.getDb = async () => {
	let data = await readFile("./db.json", "utf-8");
	return JSON.parse(data);
};

exports.writeDb = async (data) => {
	const stringData = JSON.stringify(data);
	return await writeFile("./db.json", stringData);
};
