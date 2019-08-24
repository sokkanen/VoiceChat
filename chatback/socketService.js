require('dotenv').config()

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
app.use(express.static('build'))
io.set('origins', '*:*')

const mongo = require('./database/mongo')
const query = require('./database/dbQueries')
const UserImage = require('./models/userImage')

// Cache
let users = []
let rooms = []
let fullRooms = []

app.get('*', (req, res) => {
  res.redirect('/')
})

const addNewUser = async (newUser) => {
  const result = await findUserImages(newUser.chatnick)
  if (result){
    const images = JSON.parse(result.images)
    const updatedUser = {
      ...newUser,
      images: images
    }
    users.push(updatedUser)
    io.emit('join', updatedUser)
  } else {
    users.push(newUser)
    io.emit('join', newUser)
  }
}

const changeRoom = async (user) => {
  const result = await findUserImages(user.chatnick)
  if (result){
    const images = JSON.parse(result.images)
    const updatedUser = {
      ...user,
      images: images
    }
    users = users.map(u => u.id === user.id ? updatedUser : u)
  } else {
    users = users.map(u => u.id === user.id ? user : u)
  }
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
    io.to(id).emit('error', msg)
  }
}

const roomUpdater = async (id, client_id) => {
  rooms = await query.getPublicRooms()
  let privateRooms = []
  if (id)
    privateRooms = await query.getPrivateRooms(id)
  privateRooms = await query.getPrivateRoomUsers(privateRooms)
  io.to(client_id).emit('rooms', rooms, privateRooms, fullRooms)
}

const freeRoom = (usr, isCurrent) => {
  if (usr !== undefined && usr.room !== undefined){
    if (isCurrent){
      fullRooms = fullRooms.filter(r => r !== usr.room)
      io.emit('full', fullRooms)
    } else {
      fullRooms = fullRooms.filter(r => r !== usr.oldroom)
      io.emit('full', fullRooms)
    }
  }
}

const saveOrUpdateImages = async (client_id, images, user) => {
  const imageString = JSON.stringify(images)
  const imageData = new UserImage({
    user: user,
    images: imageString
  })
  let images_id = await query.searchForUserImagesId(user)
  if (images_id){
    images_id = mongo.castStringToObjectId(images_id)
    UserImage.findOneAndUpdate({ '_id': images_id }, { 'images': imageString })
      .then(result => {
        console.log('image data updated')
        io.to(client_id).emit('imagesSaved', true)
      })
      .catch(error => {
        console.log(error)
        io.to(client_id).emit('imagesSaved', false)
      })
  } else {
    imageData
      .save()
      .then(savedImages => {
        images_id = savedImages._id
      })
      .then(() => {
        query.updateImagesIdtoUser(user, images_id)
      })
      .then(() => {
        console.log('image data and id saved')
        io.to(client_id).emit('imagesSaved', true)
      })
      .catch(error => {
        console.log(error)
        io.to(client_id).emit('imagesSaved', false)
      })
  }
}

const findUserImages = async (username) => {
  let images_id = await query.searchForUserImagesId(username)
  if (images_id){
    images_id = mongo.castStringToObjectId(images_id)
    try {
      const result = await UserImage.findOne({ '_id': images_id })
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  } else {
    return null
  }
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
    roomUpdater(id, client.id)
  })

  client.on('roomJoin', async (info) => {
    let usr = users.find(u => u.id === info.id)
    if (usr === undefined){
      addNewUser(info)
    } else {
      usr.oldroom = usr.room
      usr.room = info.room
      changeRoom(usr)
      if (info.oldroom !== info.room){
        io.emit('left', usr)
        freeRoom(usr, false)
        client.broadcast.emit('join', usr)
      }
    }
    const roomUsers = users.filter(u => u.room === info.room)
    let maxUsers = await rooms.find(r => r.name === info.room)
    if (maxUsers !== undefined){
      if (roomUsers.length + 1 >= maxUsers.user_limit){
        fullRooms.push(info.room)
        io.emit('full', fullRooms)
      }
    } else {
      const values = await query.getUser(info.chatnick)
      maxUsers = await query.getPrivateRooms(values[0].id)
      maxUsers = await maxUsers.find(r => r.name === info.room)
      if (roomUsers.length + 1 >= maxUsers.user_limit){
        fullRooms.push(info.room)
        io.emit('full', fullRooms)
      }
    }
    io.to(client.id).emit('room', info.room, roomUsers)
  })

  client.on('disconnect', () => {
    let usr = users.find(u => u.id === client.id)
    freeRoom(usr, true)
    users = users.filter(u => u.id !== client.id)
    io.emit('disconnected', usr)
    console.log('Client disconnected')
  })

  client.on('newUserRegister', async (newUser) => {
    const success = await query.addNewUser(newUser.username, newUser.email, newUser.password)
    io.to(client.id).emit('newUserRegister', success, client.id, newUser.username)
  })

  client.on('login', async (credentials) => {
    const loginValue = await query.login(credentials)
    if (loginValue === false){
      io.to(client.id).emit('login', false, client.id, null)
    } else {
      io.to(client.id).emit('login', true, client.id, loginValue)
      const oldUser = users.filter(u => u.id === client.id)[0]
      if (oldUser !== undefined){
        const usr = { ...oldUser, chatnick: loginValue.username, registered: true }
        users = users.map(u => u.id === client.id ? usr : u)
      }
    }
  })

  client.on('logout', () => {
    const usr = users.find(u => u.id === client.id)
    users = users.filter(u => u.id !== client.id)
    freeRoom(usr, true)
    io.emit('disconnected', usr)
  })

  client.on('checkChatnick', async (chatnick) => {
    const available = await query.checkChatnickAwailability(chatnick)
    io.to(client.id).emit('checkChatnick', available, client.id, chatnick)
  })

  client.on('invitation', async (invitation) => {
    let values = {
      id: client.id,
      success: false
    }
    const chatterId = await query.searchForEmailOrUsername(invitation.emailOrUsername)
    chatterId === undefined ? values.success = false
      : values.success = await query.insertInvitation(chatterId, invitation.roomId, invitation.inviter)
    io.to(client.id).emit('invitation', values)
  })
  client.on('acceptInvitation', async (invitation) => {
    await query.acceptInvitation(invitation)
    let privateRooms = await query.getPrivateRooms(invitation.invitee_id)
    privateRooms = await query.getPrivateRoomUsers(privateRooms)
    io.to(client.id).emit('updatedPrivateRooms', privateRooms)
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
  client.on('userImages', async (images, user) => {
    saveOrUpdateImages(client.id, images, user)
  })
})

const listen = () => {
  server.listen(process.env.PORT || 3000)
  console.log('server on port', process.env.PORT)
}

module.exports = { listen }