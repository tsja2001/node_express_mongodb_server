const { Video, Videocomment } = require('../model')

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

// 获取video详细数据
exports.video = async (req, res, next) => {
  try {
    const id = req.params.videoId
    const videoList = await Video.findById(id).populate(
      'user',
      '_id username image cover'
    )
    res.status(201).json({ videoList })
  } catch (error) {
    res.status(501).json({ err: error })
  }
}

// 根据视频id添加评论
exports.comment = async (req, res, next) => {
  const { videoId } = req.params
  const { comment } = req.body

  //  先查找有没有这个视频
  let videoInfo = null

  try {
    videoInfo = await Video.findById(videoId)
    if (!videoInfo) {
      res.status(401).json({ error: '暂无视频数据' })
      return
    }
  } catch (error) {
    res.status(500).json(error)
    return
  }

  // 将评论添加到视频评论表中
  try {
    await new Videocomment({
      content: comment,
      video: videoId,
      user: req.user.userinfo._id
    }).save()
  } catch (error) {
    res.status(500).json(error)
    return
  }

  // 原视频的评论数 + 1
  try {
    videoInfo.commentCount++
    await Video.findByIdAndUpdate(videoInfo._id, videoInfo)
    res.status(200).json({ success: '成功' })
  } catch (error) {
    console.log(error)
    res.status(404).json({ error: 视频不存在 })
  }
}
