const express = require('express')
const router = express.Router()
// 请求体数据验证
const validator = require('../middleware/validator/userValidator')
// 验证token
const { verifyToken } = require('../util/jwt')
// 请求处理
const userController = require('../controller/userController')

// router路由中间件三参数: .post([路径], 请求验证{可选}, 请求处理)
router
  // 注册
  .post(
    '/registers',
    validator.register,
    userController.register
  )
  // 登陆
  .post('/logins', validator.login, userController.login)
  .get('/lists', verifyToken, userController.list)
  .delete('/', userController.delete)

module.exports = router
