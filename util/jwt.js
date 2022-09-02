const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const { uuid } = require('../config/config.default')

// 使jwt.sign异步方法可以使用await调用
const tojwt = promisify(jwt.sign)
const verify = promisify(jwt.verify)

// 验证token
// required: 是否必须需要token
// true: 必须, 无token返回403
// false: 不必须, 有token就正常添加user信息, 没有就继续
module.exports.verifyToken = (required = true) => {
  return async (req, res, next) => {
    // 拿到前台发送的token
    let token = req.headers.authorization
    // 因为前台存储token时会在前面加上Bearer , 所以要先取消
    token = token ? token.split('Bearer ')[1] : null

    // 验证token正确性
    if (token) {
      try {
        const userInfo = await verify(token, uuid)

        req.user = userInfo
        // next()
      } catch {
        res.status(403).json({ error: '无效token' })
      }
      next()
    } else if (required) {
      res.status(403).json({ error: '请传入token' })
    } else {
      next()
    }
  }
}

// 生成token
module.exports.createToken = async (userinfo) => {
  return await tojwt({ userinfo }, uuid, {
    expiresIn: 60 * 60 * 24 //24小时后过期
  })
}
