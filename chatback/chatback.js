const dbclient = require('./database/dbConnection')
const mongo = require('./database/mongo')
const io = require('./socketService')

const initializeDatabase = async () => {
  await dbclient.getConnection()
  await dbclient.createTables()
}

initializeDatabase()
mongo.connect()
io.listen()

process.on('uncaughtException', (error) =>  {
  if (error.stack.match(/Zlib/)){
    console.log('Zlib exception')
  } else {
    console.error((new Date).toUTCString() + ' uncaughtException:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
})