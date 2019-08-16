const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

const connect = () => {
  mongoose.connect(url, { useNewUrlParser: true })
    .then(res => {
      console.log('Connected to MongoDb')
    })
    .catch((error) => {
      console.log('Failed to connect to MongoDb: ', error.message)
    })
}

module.exports = { connect }