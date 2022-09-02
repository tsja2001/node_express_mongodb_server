// 引入数据库集合
const { User } = require('../model')
const { createToken } = require('../util/jwt')
const md5 = require('../util/md5.js')

// 注册
exports.register = async (req, res, next) => {
  // 拿到数据库中User集合, 传入注册的数据
  const userModel = new User(req.body)
  // 给数据库的User集合写入用户数据
  const dbBack = await userModel.save()

  // 拿到注册的数据, 删除密码字段并返回给客户端
  const user = dbBack.toJSON()
  delete user.password
  res.status(201).json({ user })
}

// 登陆
exports.login = async (req, res, next) => {
  const { email, password } = req.body
  // 查找此邮箱和密码
  let dbBack = await User.findOne({ email, password })
  // 查无数据
  if (!dbBack) {
    res.status(402).json({ error: '邮箱或密码错误' })
  }
  try {
    dbBack = dbBack.toJSON()
    // 用查到的用户数据JSON生成token, 并放在dbBack上返回
    dbBack.token = await createToken(dbBack)
    res.status(200).json({ dbBack })
  } catch (err) {
    res.status(501).json({ error: '无此用户' })
  }
}

exports.list = async (req, res, next) => {
  console.log(req.method)
  try {
    res.json('/user-list')
  } catch (e) {
    console.log(e)
  }
}

exports.delete = async (req, res, next) => {
  console.log(req.method)
  res.send('/user-list')
}
