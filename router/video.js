const express = require('express')
const videoController = require('../controller/videoController')
const vodController = require('../controller/vodController')
const {
  videoValidator
} = require('../middleware/validator/videoValidator')
// 验证token
const { verifyToken } = require('../util/jwt')

const router = express.Router()

// 获取vod上传凭证
router
  .get('/getvod', vodController.getvod)
  // 保存视频的vodvideoId到数据库
  .post(
    '/creatvideo',
    verifyToken(),
    videoValidator,
    videoController.creatvideo
  )
  // 获取video分页数据
  .get(
    '/videolist',
    verifyToken(),
    videoController.videolist
  )
  // 获取video详细数据
  .get(
    '/video/:videoId',
    verifyToken(false),
    videoController.video
  )
  // 添加视频评论
  .post(
    '/comment/:videoId',
    verifyToken(),
    videoController.comment
  )
  // 删除视频评论
  .delete(
    '/comment/:videoId/:commentId',
    verifyToken(),
    videoController.deleteComment
  )
  // 查询视频评论分页
  .get('/commentlist/:videoId', videoController.commentlist)
  // 喜欢视频
  .get(
    '/like/:videoId',
    verifyToken(),
    videoController.likeVideo
  )
  // 不喜欢视频
  .get(
    '/dislike/:videoId',
    verifyToken(),
    videoController.dislikeVideo
  )

module.exports = router
