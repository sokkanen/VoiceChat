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