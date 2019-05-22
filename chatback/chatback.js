require('dotenv').config()
const io = require('socket.io')()
const users = []

const SOCKETPORT = 3003

const addNewUser = (newUser) => {
    if (users.length === 0){
        users.push(newUser)
    } else {
        let idFound = users.find(u => u.id === newUser.id)
        if (idFound !== undefined){
            const oldUsername = idFound.name
            users.map(u => u.id === newUser.id ? u.name = newUser.name : u)
            if (newUser.name !== oldUsername){
                const changeInfo = {
                    newUserName: newUser.name,
                    oldUsername: oldUsername
                }
                io.emit('changedUsername', changeInfo)
            }
        } else {
            users.push(newUser)
        }
    }
}

io.on('connection', (client) => {
    console.log('Client connected')
    client.on('messages', () => {
        console.log('Client subscribed for message')
    })
    client.on('newMessage', (message) => {
        console.log('new message:', message)
        const splittedMessage = message.split(':')
        const newUser = {
            name: splittedMessage[0],
            id: client.id
        }
        addNewUser(newUser)
        io.emit('message', message)
    })
    client.on('disconnect', () => {
        console.log('Client disconnected')
    })
})

io.listen(SOCKETPORT)
console.log('Socket portissa ', SOCKETPORT)