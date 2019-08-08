const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })
  .then(res => {
    console.log('Connected')
  })
  .catch((error) => {
    console.log('Failed to connect: ', error.message)
  })

const imageSchema = new mongoose.Schema({
  user:{
    type: String,
    required: true
  },
  letter:{
    type: String,
    required: true
  },
  data:{
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Image', imageSchema)