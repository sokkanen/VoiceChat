require('dotenv').config()
const io = require('socket.io')()

const SOCKETPORT = 3003

io.on('connection', (client) => {
    console.log('Client connected')
    client.on('messages', () => {
        console.log('Client subscribed for message')
    })
    client.on('newMessage', (message) => {
        console.log('new message: ', message)
        io.emit('message', message)
    })
    client.on('disconnect', () => {
        console.log('Client disconnected')
    })
})

io.listen(SOCKETPORT)
console.log('Socket portissa ', SOCKETPORT)