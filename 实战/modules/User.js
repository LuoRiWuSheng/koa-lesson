const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 实例化模版
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: Date.now
  },
  avatar: {
    type: String
  }
})

const User = mongoose.model('users', UserSchema)

module.exports = User