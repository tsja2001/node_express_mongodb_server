const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  vodvideoId: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User' // 和User集合关联(会自动大写转小写)
  },
  cover: {
    type: String,
    required: false
  },
  // 评价数量
  commentCount: {
    type: Number,
    default: 0
  },
  // 喜欢数量
  like: {
    type: Number,
    default: 0
  },
  // 不喜欢数量
  dislike: {
    type: Number,
    default: 0
  },
  ...baseModel
})

module.exports = videoSchema
