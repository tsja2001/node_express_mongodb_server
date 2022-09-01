// 使用mongoose库连接🥭数据库

const mongoose = require('mongoose')

// 最后的是数据库名称
async function main() {
  await mongoose.connect('mongodb://localhost:27017/rexpress-video')
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
  User: mongoose.model('User', require('./userModel'))
}
