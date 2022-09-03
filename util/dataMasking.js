// 对返回的数据进行脱敏
const loadsh = require('loadsh')

exports.userDataMasking = (data) => {
  const res = loadsh.pick(data, [
    '_id',
    'username',
    'image',
    'cover',
    'channeldes',
    'subscribeCount',
    'followCount'
  ])

  return res
}
