const {MongoClient} = require("mongodb");

const client = new MongoClient("mongodb://127.0.0.1:27017");

// 用于获取集合
const clientFun = async function (c) {
	await client.connect();
	const db = client.db("mytest");
	return db.collection(c);
};

const main = async () => {
	// 获取数据库中cc集合
	const cc = await clientFun("cc");
	// // 插入
	// const res = await cc.insertOne({username: "node", age: 20});
	// const res = await cc.insertMany([
	// 	{username: "node2", age: 20},
	// 	{username: "node3", age: 30},
	// ]);

	// // 查询
	// const oneRes = await cc.findOne({username: "node"});
	// console.log(oneRes);
	// const manyRes = await cc.find({age: {$gt: 20}});
	// console.log(await manyRes.toArray());

	// // 更新
	// const update = await cc.updateOne(
	// 	{username: "node"},
	// 	{$set: {username: "哈哈哈哈哈哈哈"}}
	// );
	// console.log(update);

	// 删除
	await cc.deleteOne({age: {$gt: 20}});

	// 打印集合内容
	const d = await cc.find();
	// console.log(await d.toArray());
};

main().finally(() => client.close());
