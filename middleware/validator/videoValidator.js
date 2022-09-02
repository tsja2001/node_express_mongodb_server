// 用于做用户部分, 请求的数据验证
const { body } = require('express-validator')
const validate = require('./errorBack')
const { User } = require('../../model/index')

// 注册验证
module.exports.videoValidator = validate([
  body('title')
    .notEmpty()
    .withMessage('标题不能为空')
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage('标题长度介于3到20之间'),
  body('vodvideoId')
    .notEmpty()
    .withMessage('vod不能为空')
    .bail()
])
