require('dotenv').config()
const io = require('socket.io')()
const query = require('./database/dbQueries')
const SOCKETPORT = process.env.SOCKETPORT

let users = []
let rooms = []

const addNewUser = (newUser) => {
    users.push(newUser)
    io.emit('users', users)
}

const changeRoom = (user) => {
    users = users.map(u => u.id === user.id ? user : u)
    io.emit('users', users)
}

const newRoomHandler = async (room, user, id) => {
    const success = await query.addNewRoom(room, user)
    if (success){
        rooms.push(room)
    } else {
        const msg = {
            id: id,
            message: `Room ${room.title} already exists. Please choose another roomname.`
        }
        io.emit('error', msg)
    }
    io.emit('rooms', rooms)
    
}

io.on('connection', (client) => {
console.log('Client connected')

    client.on('newMessage', (message) => {
        io.emit('message', message)
    })
    client.on('newRoom', (room, user) => {
        newRoomHandler(room, user, client.id)
    })
    client.on('requestRooms', async () => {
        rooms = await query.getPublicRooms()
        io.emit('rooms', rooms)
    })
    client.on('requestUsers', () => {
        io.emit('users', users)
    })
    client.on('roomJoin', (info) => {
        let usr = users.find(u => u.id === info.id)
        if (usr === undefined){
            addNewUser(info)
        } else {
            usr.oldroom = usr.room
            usr.room = info.room
            changeRoom(usr)
            if (info.oldroom !== info.room){
                io.emit('left', usr)
            }
        }
        io.emit('room', info.room, info.id)
    })
    client.on('disconnect', () => {
        let usr = users.find(u => u.id === client.id)
        users = users.filter(u => u.id !== client.id)
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
    client.on('checkChatnick', async (chatnick) => {
        const available = await query.checkChatnickAwailability(chatnick)
        io.emit('checkChatnick', available, client.id, chatnick)
    })
})

const listen = () => {
    io.listen(SOCKETPORT)
    console.log('Socket portissa ', SOCKETPORT)
}

module.exports = { listen }