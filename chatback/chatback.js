require('dotenv').config()
const io = require('socket.io')()

const SOCKETPORT = 3003
let i = 1

const endlessMessages = (client) => {
    let message = 'HELLO!' + i
    setInterval(() => {
        io.emit('message', message);
        i+=1
        message = 'HELLO!' + i
    }, 1000);
}

io.on('connection', (client) => {
    console.log('Client connected')
    endlessMessages(client)
    client.on('messages', () => {
        console.log('Client subscribed for message')
    })
    client.on('disconnect', () => {
        console.log('Client disconnected')
    })
})

io.listen(SOCKETPORT)
console.log('Socket portissa ', SOCKETPORT)