const { Video } = require('../model')

exports.creatvideo = async (req, res, next) => {
  const id = req.user.userinfo._id

  const body = req.body
  body.user = id
  // 创建数据库集合实例, 传入数据
  const videoModel = new Video(req.body)
  // 保存数据
  try {
    const dbBack = await videoModel.save()
    res.status(201).json(dbBack)
  } catch (error) {
    res.status(201).json({ err: dbBack })
  }
}

exports.list = async (req, res, next) => {
  console.log(req.method)
  res.send('/video-list')
}

exports.delete = async (req, res, next) => {
  console.log(req.method)
  res.send('/video-list')
}
