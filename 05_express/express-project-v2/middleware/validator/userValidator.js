// 用于做用户部分, 请求的数据验证
const { body, validationResult } = require('express-validator')
const validate = require('./errorBack')
const { User } = require('../../model/index')
module.exports.register = validate([
  body('username')
    .notEmpty()
    .withMessage('用户名不能为为空')
    .bail() // .bail()如果前面验证失败, 则不进行后续验证
    .isLength({ min: 3 })
    .withMessage('用户名长度不能小于3'),
  body('email')
    .notEmpty()
    .withMessage('邮箱不能为为空')
    .isEmail()
    .custom(async (val) => {
      const emailValidate = await User.findOne({ email: val })
      if (emailValidate) {
        return Promise.reject('邮箱已被注册')
      }
    })
    .bail(),
  ,
  body('password').isLength({ min: 5 }).withMessage('密码至少5位'),
  body('phone')
    .custom(async (val) => {
      const phoneValidate = await User.findOne({ phone: val })
      if (phoneValidate) {
        return Promise.reject('手机号已被注册')
      }
    })
    .bail()
])

module.exports.login = validate([
  body('email')
    .notEmpty()
    .withMessage('邮箱不能为为空')
    .bail()
    .isEmail()
    .withMessage('邮箱格式不正确'),
  body('password').notEmpty().withMessage('密码不能为为空')
])
