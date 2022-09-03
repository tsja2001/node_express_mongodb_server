// 引入数据库集合
const { User, Subscribe } = require('../model')
const { createToken } = require('../util/jwt')
const fs = require('fs')
const { promisify } = require('util')
const rename = promisify(fs.rename)
const loadsh = require('loadsh')

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

// 订阅用户
exports.subscribe = async (req, res, next) => {
  // 要订阅的用户
  const targetUserId = req.params.userId
  // 当前用户
  const currentUserId = req.user.userinfo._id

  // 当关注自己时
  if (targetUserId === currentUserId) {
    res.status(403).json({ error: '不能关注自己' })
    return
  }

  // 关注别人时, 查询是否已经关注
  const dbBack = await Subscribe.findOne({
    user: currentUserId,
    channel: targetUserId
  })

  if (dbBack) {
    // 已经关注
    res.status(403).json({ error: '不能重复关注' })
    return
  } else {
    try {
      // 未关注, 保存关注信息
      await new Subscribe({
        user: currentUserId,
        channel: targetUserId
      }).save()

      // 本人关注数 + 1
      const currentUserData = await User.findById(
        currentUserId
      )
      currentUserData.followCount++

      await User.findByIdAndUpdate(
        currentUserId,
        currentUserData
      )

      // 对方粉丝数 + 1
      const targetUserData = await User.findById(
        targetUserId
      )
      targetUserData.subscribeCount++
      console.log(
        'subscribeCount:' + targetUserData.subscribeCount
      )
      await User.findByIdAndUpdate(
        targetUserId,
        targetUserData
      )

      res.status(201).json({ success: '关注成功' })
      return
    } catch (error) {
      res.status(403).json({ error: error })
    }
  }
}
// 取消订阅用户
exports.unsubscribe = async (req, res, next) => {
  const targetUserId = req.params.userId
  const currentUserId = req.user.userinfo._id

  // 当关注自己时
  if (targetUserId === currentUserId) {
    res.status(403).json({ error: '不能取消关注自己' })
    return
  }

  // 关注别人时, 查询是否已经关注
  const dbBack = await Subscribe.findOne({
    user: currentUserId,
    channel: targetUserId
  })

  if (!dbBack) {
    // 没有关注
    res.status(403).json({ error: '不能重复取消关注' })
    return
  } else {
    try {
      // 已关注, 删除关注信息
      await dbBack.remove()

      // 本人关注数 - 1
      const currentUserData = await User.findById(
        currentUserId
      )
      currentUserData.followCount--
      console.log(
        'followCount:' + currentUserData.followCount
      )
      await User.findByIdAndUpdate(
        currentUserId,
        currentUserData
      )

      // 对方粉丝数 - 1
      const targetUserData = await User.findById(
        targetUserId
      )
      targetUserData.subscribeCount--
      console.log(
        'subscribeCount:' + targetUserData.subscribeCount
      )
      await User.findByIdAndUpdate(
        targetUserId,
        targetUserData
      )

      res.status(201).json({ success: '取消关注成功' })
      return
    } catch (error) {
      res.status(403).json({ error: error })
    }
  }
}

// 查询用户频道
exports.getuser = async (req, res, next) => {
  const targetUserId = req.params.userId
  try {
    // 查询用户频道信息
    const dbBack = await User.findById(targetUserId)

    // 如果已登陆, 查询当前用户和目标用户的关注关系
    const currentUserId = req.user.userinfo._id

    let ifFollower = false
    let ifBeFollowered = false
    if (currentUserId) {
      // 是否关注了他
      const followerBack = await Subscribe.findOne({
        user: currentUserId,
        channel: targetUserId
      })
      if (followerBack) ifFollower = true

      // 是否被关注了
      const beFollowered = await Subscribe.findOne({
        user: targetUserId,
        channel: currentUserId
      })
      if (beFollowered) ifBeFollowered = true
    }

    res.status(201).json({
      ...loadsh.pick(dbBack, [
        '_id',
        'username',
        'image',
        'cover',
        'subscribeCount'
      ]),
      ifFollower,
      ifBeFollowered
    })
  } catch (error) {
    console.log(error)
    res.status(403).json({ error: error })
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
