// 用于做用户部分, 请求的数据验证
const {
  body,
  validationResult
} = require('express-validator')
const validate = require('./errorBack')
const { User } = require('../../model/index')

// 注册验证
module.exports.register = validate([
  body('username')
    .notEmpty()
    .withMessage('用户名不能为为空')
    .bail() // .bail()如果前面验证失败, 则不进行后续验证
    .isLength({ min: 3 })
    .withMessage('用户名长度不能小于5')
    .custom(async (val) => {
      // 验证数据库中用户名唯一性
      const usernameValidate = await User.findOne({
        username: val
      })
      if (usernameValidate) {
        return Promise.reject(
          '此用户名已注册, 请使用其他用户名'
        )
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
    .bail()
    .isLength({ min: 3 })
    .withMessage('用户名长度不能小于3'),
  body('email')
    .notEmpty()
    .withMessage('邮箱不能为为空')
    .bail()
    .isEmail()
    .withMessage('请输入正确的邮箱格式')
    .bail()
    .custom(async (val) => {
      // 验证数据库中邮箱唯一性
      const emailValidate = await User.findOne({
        email: val
      })
      if (emailValidate) {
        return Promise.reject('邮箱已被注册')
      }
    })
    .bail(),
  ,
  body('password')
    .isLength({ min: 5 })
    .withMessage('密码至少5位'),
  body('phone')
    .custom(async (val) => {
      const phoneValidate = await User.findOne({
        phone: val
      })
      if (phoneValidate) {
        return Promise.reject('手机号已被注册')
      }
    })
    .bail()
])

// 登陆验证
module.exports.login = validate([
  body('email')
    .notEmpty()
    .withMessage('邮箱不能为为空')
    .bail()
    .isEmail()
    .withMessage('邮箱格式不正确')
    .bail()
    .custom(async (val) => {
      const emailValidate = await User.findOne({
        email: val
      })
      if (!emailValidate) {
        return Promise.reject('邮箱未注册')
      }
    })
    .bail(),
  body('password').notEmpty().withMessage('密码不能为为空')
])

// 修改验证
module.exports.update = validate([
  body('email').custom(async (val) => {
    const emailValidate = await User.findOne({
      email: val
    })
    if (emailValidate) {
      return Promise.reject('邮箱已被注册')
    }
  }),

  body('username')
    .custom(async (val) => {
      const usernameValidate = await User.findOne({
        username: val
      })
      if (usernameValidate) {
        return Promise.reject('用户已被注册')
      }
    })
    .bail(),
  ,
  body('phone')
    .custom(async (val) => {
      const phoneValidate = await User.findOne({
        phone: val
      })
      if (phoneValidate) {
        return Promise.reject('手机号已被注册')
      }
    })
    .bail()
])
