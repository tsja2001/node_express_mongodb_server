const { Video } = require('../model')

// 保存视频的vodvideoId到数据库
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
    res.status(501).json({ err: error })
  }
}

// 获取video分页数据
exports.videolist = async (req, res, next) => {
  // 保存数据
  try {
    const { pageNum = 0, pageSize = 10 } = req.body
    const videoList = await Video.find()
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .sort({ createAt: -1 })
      .populate('user')
    const videoTotalCount = await Video.countDocuments()
    res.status(201).json({ videoList, videoTotalCount })
  } catch (error) {
    res.status(501).json({ err: error })
  }
}
