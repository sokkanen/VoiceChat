require('dotenv').config()
const io = require('socket.io')()
let users = []

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
            io.emit('newUser', newUser.name)
        }
    }
    io.emit('users', users)
}

io.on('connection', (client) => {
    console.log('Client connected')
    const newUser = {
        name: 'Anonymous',
        id: client.id
    }
    addNewUser(newUser)
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
    client.on('newUserName', (user) => {
        const newUser = {
            id: client.id,
            name: user
        }
        addNewUser(newUser)
    })
    client.on('newRoom', (room) => {
        console.log(room)
    })
    client.on('disconnect', () => {
        let usr = users.find(u => u.id === client.id)
        users = users.filter(u => u.id !== client.id)
        if (!usr){
          usr = {
              name: 'Anonymous'
          }
        }
        io.emit('disconnected', usr.name)
        io.emit('users', users)
        console.log('Client disconnected')
    })
})

io.listen(SOCKETPORT)
console.log('Socket portissa ', SOCKETPORT)