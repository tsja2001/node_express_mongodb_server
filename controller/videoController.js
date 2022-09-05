const {
  Video,
  Videocomment,
  VideoLike,
  Subscribe
} = require('../model')

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
    const videoRes = videoList.toJSON()
    videoRes.islike = false
    videoRes.isdislike = false
    videoRes.issubscribe = false

    // 如果已经登陆, 返回点赞和关注信息
    if (req.user.userinfo) {
      const userId = req.user.userinfo._id
      // 如果点赞了
      if (
        await VideoLike.findOne({
          user: userId,
          video: id,
          like: 1
        })
      ) {
        videoRes.islike = true
      }

      // 如果点踩了
      if (
        await VideoLike.findOne({
          user: userId,
          video: id,
          like: -1
        })
      ) {
        videoRes.isdislike = true
      }

      // 如果已经关注了
      console.log(userId, videoList._id)
      if (
        await Subscribe.findOne({
          user: userId,
          channel: videoList._id
        })
      ) {
        videoRes.issubscribe = true
      }
    }

    res.status(201).json({ videoRes })
  } catch (error) {
    res.status(501).json({ err: error })
    console.log(error)
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

// 删除视频评论
exports.deleteComment = async (req, res) => {
  const { videoId, commentId } = req.params
  try {
    // 验证存在此视频
    const videoDbBack = await Video.findById(videoId)
    if (!videoDbBack) {
      res.status(403).json({ error: '无此视频' })
      return
    }

    // 验证存在此评论
    const commentDbback = await Videocomment.findById(
      commentId
    )
    if (!commentDbback) {
      res.status(403).json({ error: '无此评论' })
      return
    }

    // 验证此评论为当前用户发表
    const id = req.user.userinfo._id
    if (!commentDbback.user.equals(id)) {
      res.status(403).json({ error: '暂无权限' })
      return
    }

    // 执行删除操作
    await commentDbback.remove()
    // // 视频评论 - 1
    videoDbBack.commentCount--
    await videoDbBack.save()

    res.status(200).json({ success: '操作成功' })
    // res.json(commentId)
  } catch (error) {
    res.status(403).json(error)
  }
}

// 获取video分页数据
exports.commentlist = async (req, res) => {
  // 保存数据
  try {
    const { pageNum = 0, pageSize = 10 } = req.body
    const videoId = req.params.videoId

    const commentList = await Videocomment.find({
      video: videoId
    })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .sort({ createAt: -1 })
      .populate('user', 'id username image')

    const videoTotalCount =
      await Videocomment.countDocuments({
        video: videoId
      })
    res.status(201).json({ commentList, videoTotalCount })
  } catch (error) {
    res.status(501).json({ err: error })
  }
}

// 喜欢视频
exports.likeVideo = async (req, res) => {
  // 拿到id
  const videoId = req.params.videoId
  const userId = req.user.userinfo._id
  let resText = ''

  // 验证存在此视频
  const videoDbBack = await Video.findById(videoId)
  if (!videoDbBack) {
    res.status(404).json({ error: '无此视频' })
    return
  }

  try {
    // 查询是否已经点击喜欢
    const videoLikeDbBack = await VideoLike.findOne({
      video: videoId,
      user: userId
    })

    if (videoLikeDbBack && videoLikeDbBack.like == 1) {
      // 如果已经喜欢 删除此条, 喜欢数 - 1
      resText = '已取消点赞'
      await videoLikeDbBack.remove()
    } else if (
      // 如果不喜欢 删除此条, 不喜欢数 - 1, 喜欢数 + 1
      videoLikeDbBack &&
      videoLikeDbBack.like == -1
    ) {
      resText = '点赞成功'
      videoLikeDbBack.like = 1
      await videoLikeDbBack.save()
    } else {
      // 如果之前没点过
      resText = '点赞成功'
      await new VideoLike({
        video: videoId,
        user: userId,
        like: 1
      }).save()
    }

    // 统计所有喜欢和不喜欢的条数, 更新到video集合中
    videoDbBack.like = await VideoLike.countDocuments({
      video: videoId,
      like: 1
    })
    videoDbBack.dislike = await VideoLike.countDocuments({
      video: videoId,
      like: -1
    })
    await videoDbBack.save()
    res.status(201).json({ success: resText })
  } catch (error) {
    console.log(error)
    res.status(403).json({ error: 'error' })
  }
}

// 不喜欢视频
exports.dislikeVideo = async (req, res) => {
  // 拿到id
  const videoId = req.params.videoId
  const userId = req.user.userinfo._id

  // 验证存在此视频
  const videoDbBack = await Video.findById(videoId)
  if (!videoDbBack) {
    res.status(404).json({ error: '无此视频' })
    return
  }

  try {
    // 查询是否已经点击不喜欢
    const videoLikeDbBack = await VideoLike.findOne({
      video: videoId,
      user: userId
    })

    if (videoLikeDbBack && videoLikeDbBack.like == -1) {
      // 如果已经不喜欢 删除此条
      resText = '已取消点踩'
      await videoLikeDbBack.remove()
    } else if (
      // 如果喜欢 更改为不喜欢
      videoLikeDbBack &&
      videoLikeDbBack.like == 1
    ) {
      resText = '收到您的反馈'
      videoLikeDbBack.like = -1
      await videoLikeDbBack.save()
    } else {
      // 如果之前没点过
      resText = '收到您的反馈'
      await new VideoLike({
        video: videoId,
        user: userId,
        like: -1
      }).save()
    }

    // 统计所有喜欢和不喜欢的条数, 更新到video集合中
    videoDbBack.like = await VideoLike.countDocuments({
      video: videoId,
      like: 1
    })
    videoDbBack.dislike = await VideoLike.countDocuments({
      video: videoId,
      like: -1
    })
    await videoDbBack.save()
    res.status(201).json({ success: resText })
  } catch (error) {
    res.status(403).json({ error: error })
  }
}
