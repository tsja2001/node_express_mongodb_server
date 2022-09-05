const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const videoLikeSchema = new mongoose.Schema({
  video: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'Video' // 和User集合关联(会自动大写转小写)
  },
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User' // 和User集合关联(会自动大写转小写)
  },
  like: {
    type: Number,
    required: true,
    enum: [-1, 1]
  },
  ...baseModel
})

module.exports = videoLikeSchema
