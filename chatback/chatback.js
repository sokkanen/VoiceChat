const dbclient = require('./dbConnection')
const io = require('./socketService')

dbclient.getConnection()
io.listen()
