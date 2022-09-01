// 引入数据库集合
const { User } = require('../model')
const jwt = require('jsonwebtoken')
// 注册
exports.register = async (req, res, next) => {
  const userModel = new User(req.body)

  const dbBack = await userModel.save()

  const user = dbBack.toJSON()
  delete user.password
  res.status(201).json({ user })
}

// 登陆
exports.login = async (req, res, next) => {
  // const userModel = new User(req.body);
  const { email, password } = req.body
  const dbback = await User.findOne({ email })
  if (!dbback) {
    res.status(401).json({ error: '无此用户数据' })
  }

  res.status(200).json({ dbback })

  // 客户端数据验证
  // User.
  // 连接数据库查询
  console.log(dbback)
  // res.json({dbback});
}
exports.list = async (req, res, next) => {
  console.log(req.method)
  res.send('/user-list')
}

exports.delete = async (req, res, next) => {
  console.log(req.method)
  res.send('/user-list')
}
