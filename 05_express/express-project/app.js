const express = require("express");
const router = require("./router");
const app = express();

// 如果想球球/index, 需要输入路径/user/index
app.use("/user", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
