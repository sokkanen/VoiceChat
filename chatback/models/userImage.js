const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  user:{
    type: String,
    required: true
  },
  images:{
    type: String,
    required: true
  }
})

module.exports = mongoose.model('UserImage', imageSchema)