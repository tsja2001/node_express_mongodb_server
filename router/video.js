const express = require('express')
const videoController = require('../controller/videoController')
const vodController = require('../controller/vodController')

const router = express.Router()

// 获取vod上传凭证
router.get('/getvod', vodController.getvod)

module.exports = router
