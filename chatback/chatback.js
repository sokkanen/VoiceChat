const dbclient = require('./dbConnection')
const io = require('./socketService')

const initializeDatabase = async () => {
    await dbclient.getConnection()
    await dbclient.createTables()
}

initializeDatabase()
io.listen()
