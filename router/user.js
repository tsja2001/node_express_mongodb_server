const express = require('express')
const router = express.Router()
// 请求体数据验证
const validator = require('../middleware/validator/userValidator')
// 验证token
const { verifyToken } = require('../util/jwt')
// 请求处理
const userController = require('../controller/userController')
// 文件上传
const multer = require('multer')
const upload = multer({ dest: 'public/' })

// router路由中间件三参数: .post([路径], 请求验证{可选, 可多个}, 请求处理)
router
  // 注册
  .post(
    '/registers',
    validator.register,
    userController.register
  )
  // 登陆
  .post('/logins', validator.login, userController.login)
  // 修改用户信息
  .put(
    '/',
    verifyToken(),
    validator.update,
    userController.update
  )
  // 更改用户头像
  // 会自动调用upload.single上传, 文件名为headimg, 上传成功数据放在req.file
  .post(
    '/headimg',
    verifyToken(),
    upload.single('headimg'),
    userController.headimg
  )
  // 修改用户信息
  .put(
    '/',
    verifyToken(),
    validator.update,
    userController.update
  )
  // 订阅用户
  .get(
    '/subscribe/:userId',
    verifyToken(),
    userController.subscribe
  )
  // 取消订阅用户
  .get(
    '/unsubscribe/:userId',
    verifyToken(),
    userController.unsubscribe
  )
  .get('/lists', verifyToken(), userController.list)

module.exports = router
