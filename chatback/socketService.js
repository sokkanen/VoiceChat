require('dotenv').config()
const io = require('socket.io')()
const query = require('./database/dbQueries')
const SOCKETPORT = process.env.SOCKETPORT

let users = []
let rooms = []

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
        let usr = users.find(u => u.id === client.id)
        const newRoom = {...room, user: usr}
        addNewRoom(newRoom, client.id)
    })
    client.on('requestRooms', () => {
        io.emit('rooms', rooms)
    })
    client.on('requestUsers', () => {
        io.emit('users', users)
    })
    client.on('roomJoin', (info) => {
        let usr = users.find(u => u.id === info.id)
        usr.room = info.room
        usr.oldroom = info.oldroom
        if (!usr.name){
            usr.name = 'Anonymous'
        }
        addNewUser(usr)
        io.emit('room', info.room)
        if (info.oldroom !== info.room){
            io.emit('left', usr)
        }
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
    client.on('newUserRegister', async (newUser) => {
        const success = await query.addNewUser(newUser.username, newUser.email, newUser.password)
        io.emit('newUserRegister', success, client.id, newUser.username)
    })
    client.on('login', async (credentials) => {
        const loginValue = await query.login(credentials)
        if (loginValue === false){
            io.emit('login', false, client.id, null)
        } else {
            io.emit('login', true, client.id, loginValue)
        }
    })
})

const listen = () => {
    io.listen(SOCKETPORT)
    console.log('Socket portissa ', SOCKETPORT)
}

module.exports = { listen }