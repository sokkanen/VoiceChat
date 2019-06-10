require('dotenv').config()
const io = require('socket.io')()
let users = []
let rooms = []

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
                    oldUsername: oldUsername,
                    room: newUser.room
                }
                io.emit('changedUsername', changeInfo)
            }
        } else {
            users.push(newUser)
            io.emit('newUser', newUser)
        }
    }
    io.emit('users', users)
}

const addNewRoom = (newRoom, id) => {
    const roomNames = rooms.map(r => r.title)
    if (roomNames.includes(newRoom.title)){
        const msg = {
            message: `Room with a name '${newRoom.title}' already exists`,
            id: id
        }
        io.emit('error', msg)
    } else {
        rooms.push(newRoom)
        io.emit('rooms', rooms)
    }
}

io.on('connection', (client) => {
    console.log('Client connected')
    const newUser = {
        name: 'Anonymous',
        id: client.id,
        room: null
    }
    addNewUser(newUser)
    client.on('messages', () => {
        console.log('Client subscribed for message')
    })
    client.on('newMessage', (message) => {
        console.log('new message:', message)
        const newUser = {
            name: message.user,
            id: client.id,
            room: message.room
        }
        addNewUser(newUser)
        io.emit('message', message)
    })
    client.on('newUserName', (user) => {
        const newUser = {
            id: client.id,
            name: user.name,
            room: user.room
        }
        addNewUser(newUser)
    })
    client.on('newRoom', (room) => {
        const newRoom = {...room, user: 'not implemented yet'}
        addNewRoom(newRoom, client.id)
    })
    client.on('requestRooms', () => {
        io.emit('rooms', rooms)
    })
    client.on('roomJoin', (info) => {
        console.log(info) // TOIMII, LOGIIKKA PITÄÄ VIELÄ RAKENTAA
    })
    client.on('disconnect', () => {
        let usr = users.find(u => u.id === client.id)
        users = users.filter(u => u.id !== client.id)
        if (!usr){
          usr = {
              name: 'Anonymous'
          }
        }
        io.emit('disconnected', usr)
        io.emit('users', users)
        console.log('Client disconnected')
    })
})

io.listen(SOCKETPORT)
console.log('Socket portissa ', SOCKETPORT)