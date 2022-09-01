const mongoose = require('mongoose')
const md5 = require('../util/md5.js')
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
    set: (value) => md5(value), // 存储时以md5形式加密
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
  createAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
})

module.exports = userSchema
