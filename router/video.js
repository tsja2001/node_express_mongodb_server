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
router.get('/getvod', vodController.getvod)
// 保存视频的vodvideoId到数据库
router.post(
  '/creatvideo',
  verifyToken,
  videoValidator,
  videoController.creatvideo
)
// 获取video分页数据
router.get(
  '/videolist',
  verifyToken,
  videoController.videolist
)

module.exports = router
