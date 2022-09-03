const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const subscribeSchema = new mongoose.Schema({
  // 粉丝
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  // 被关注者
  channel: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  ...baseModel
})

module.exports = subscribeSchema
