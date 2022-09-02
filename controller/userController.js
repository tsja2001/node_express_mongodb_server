// 引入数据库集合
const { User } = require('../model')
const { createToken } = require('../util/jwt')
const fs = require('fs')
const { promisify } = require('util')
const rename = promisify(fs.rename)

// 注册
exports.register = async (req, res, next) => {
  // 拿到数据库中User集合, 传入注册的数据
  const userModel = new User(req.body)
  // 给数据库的User集合写入用户数据
  const dbBack = await userModel.save()

  // 拿到注册的数据, 删除密码字段并返回给客户 端
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

// 修改用户信息
exports.update = async (req, res, next) => {
  const _id = req.user.userinfo._id
  // 默认返回修改前结果, 传入第三个参数{new: true}会返回修改后的结果
  const dbBack = await User.findByIdAndUpdate(
    _id,
    req.body,
    { new: true }
  )

  if (!dbBack) {
    res.status(501).json({ err: '修改失败' })
  }

  try {
    res.status(202).json({ user: dbBack })
  } catch (error) {
    res.status(501).json({ err: '修改失败' })
  }
}

// 更改用户头像
exports.headimg = async (req, res, next) => {
  /**
   * multer库上传文件后写入req.file的数据:
   * 此时filename没有后缀名, 无法正常读取, 需要加上后缀
   * {
   *   fieldname: 'headimg',
   *   originalname: '31shouyexuanzhong.png',
   *   encoding: '7bit',
   *   mimetype: 'image/png',
   *   destination: 'public/',
   *   filename: '7a7ca929c4816d987049d9949863fded', // 文件名
   *   path: 'public/7a7ca929c4816d987049d9949863fded',
   *   size: 2614
   * }
   */
  const file = req.file
  const fileArr = file.originalname.split('.')
  const fileType = fileArr[fileArr.length - 1]
  // 拿到图片带后缀的原名
  const fileRealName = file.filename + '.' + fileType
  console.log(fileRealName)
  // 对存储的文件进行重命名
  try {
    await rename(
      './public/' + file.filename,
      './public/' + fileRealName
    )

    res.status(201).send(fileRealName)
  } catch (error) {
    res.status(500).json({ error: error })
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
