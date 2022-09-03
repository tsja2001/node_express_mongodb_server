const mongoose = require('mongoose')
const md5 = require('../util/md5.js')
const baseModel = require('./baseModel')
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    // 密码存储时以md5形式加密, 查询时只需传入明文, 会自动加密后查找
    set: (value) => md5(value),
    select: false // 查询时忽略此条
  },
  phone: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  // 频道封面
  cover: {
    type: String,
    default: null
  },
  // 频道描述
  channeldes: {
    type: String,
    default: null
  },
  // 粉丝数
  subscribeCount: {
    type: Number,
    default: 0
  },
  // 关注数
  followCount: {
    type: Number,
    default: 0
  },
  ...baseModel
})

module.exports = userSchema
