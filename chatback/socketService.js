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
}

const roomUpdater = async (id) => {
    rooms = await query.getPublicRooms()
    let privateRooms = []
    if (id)
        privateRooms = await query.getPrivateRooms(id)
        privateRooms = await query.getPrivateRoomUsers(privateRooms)
    io.emit('rooms', rooms, privateRooms)
}

io.on('connection', (client) => {
console.log('Client connected')

    client.on('newMessage', (message) => {
        io.emit('message', message)
    })

    client.on('newRoom', (room, user) => {
        newRoomHandler(room, user, client.id)
    })

    client.on('requestRooms', async (id) => {
        roomUpdater(id)
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
            const oldUser = users.filter(u => u.id === client.id)[0]
            if (oldUser !== undefined){
                const usr = {...oldUser, chatnick: loginValue.username, registered: true}
                users = users.map(u => u.id === client.id ? usr : u)
                io.emit('users', users)
            }
        }
    })

    client.on('logout', () => {
        users = users.filter(u => u.id !== client.id)
        io.emit('users', users)
    })

    client.on('checkChatnick', async (chatnick) => {
        const available = await query.checkChatnickAwailability(chatnick)
        io.emit('checkChatnick', available, client.id, chatnick)
    })

    client.on('invitation', async (invitation) => {
        let values = {
            id: client.id,
            success: false
        }
        const chatterId = await query.searchForEmailOrUsername(invitation.emailOrUsername)
        chatterId === undefined ? values.success = false
        : values.success = await query.insertInvitation(chatterId, invitation.roomId, invitation.inviter)
        io.emit('invitation', values)
    })
    client.on('acceptInvitation', async (invitation) => {
        await query.acceptInvitation(invitation)
        const privateRooms = await query.getPrivateRooms(invitation.invitee_id)
        io.emit('updatedPrivateRooms', privateRooms)
    })
    client.on('declineInvitation', async (invitation) => {
        await query.removeInvitation(invitation)
    })
    client.on('removeRoom', async (room, token) => {
        const id = await query.removeRoom(room, token)
        if (id === false){
            console.log('Error in removing room')
        }
        roomUpdater(id)
    })
})

const listen = () => {
    io.listen(SOCKETPORT)
    console.log('Socket portissa ', SOCKETPORT)
}

module.exports = { listen }