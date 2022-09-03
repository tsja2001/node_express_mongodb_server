// 使用mongoose库连接🥭数据库

const mongoose = require('mongoose')
const { mongopath } = require('../config/config.default')

// 最后的是数据库名称
async function main() {
  await mongoose.connect(mongopath)
}

main()
  .then((res) => {
    console.log('连接成功')
  })
  .catch((err) => {
    console.log(err)
    console.log('连接失败')
  })

module.exports = {
  User: mongoose.model('User', require('./userModel')),
  Video: mongoose.model('Video', require('./videoModel')),
  Videocomment: mongoose.model(
    'Videocomment',
    require('./videocommentModel')
  ),
  Subscribe: mongoose.model(
    'Subscribe',
    require('./subscribeModel')
  )
}
