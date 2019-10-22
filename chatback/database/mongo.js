const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

const connect = () => {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
      console.log('Connected to MongoDb')
    })
    .catch((error) => {
      console.log('Failed to connect to MongoDb: ', error.message)
    })
}

const castStringToObjectId = (string) => {
  string = string.substring(1, string.length - 1)
  return new ObjectId(string)
}

module.exports = { connect, castStringToObjectId }