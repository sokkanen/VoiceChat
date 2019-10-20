const uuid = require('uuid/v1')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dbConnection = require('./dbConnection')
const client = dbConnection.client
const saltRounds = 10

const createHash = (password) => {
  try {
    const passhash = bcrypt.hashSync(password, saltRounds)
    return passhash
  } catch (error) {
    console.log(error)
  }
}

const validatePassword = (password, passhash) => {
  const validated = bcrypt.compare(password, passhash)
  return validated
}

const addNewRoom = async (room, user) => {
  const verified = jwt.verify(user.token, process.env.TOKENSECRET)
  if (!verified.id ||!user.token){
    console.log('verification failed')
    return false
  }
  const sql = ('INSERT INTO room (id, name, description, private, owner_id, user_limit) values ($1, $2, $3, $4, $5, $6)')
  const id = uuid()
  const values = [id, room.title, room.description, room.private, verified.id, room.user_limit]
  try {
    await client.query(sql, values)
  } catch(error){
    console.log(error)
    return false
  }
  if (room.private){
    const sql2 = ('INSERT INTO room_chatter (chatter_id, room_id) values ($1, $2)')
    const values2 = [verified.id, id]
    try {
      await client.query(sql2, values2)
    } catch(error){
      console.log(error)
      return false
    }
  }
  return true
}

const addNewUser = async (username, email, password) => {
  const id = uuid()
  const passhash = createHash(password)
  const sql = ('INSERT INTO chatter (id, username, email, passhash) VALUES ($1, $2, $3, $4);')
  const values = [id, username, email, passhash]
  try {
    await client.query(sql, values)
    return true
  } catch (error) {
    return false
  }
}

const removeUser = async (username) => {
  try {
    await client.query('BEGIN')
    const user = await getUser(username)
    const sql = ('DELETE FROM Invite WHERE chatter_id = $1 OR inviter = $2 OR room_id IN (SELECT id FROM room WHERE owner_id = $1)')
    const values = [user[0].id, username]
    let res = await client.query(sql, values)
    const sql2 = ('DELETE FROM Room_chatter WHERE chatter_id = $1 OR room_id IN (SELECT id FROM room WHERE owner_id = $1)')
    const values2 = [user[0].id]
    res = await client.query(sql2, values2)
    const sql3 = ('DELETE FROM Room WHERE owner_id = $1')
    const values3 = [user[0].id]
    res = await client.query(sql3, values3)
    const sql4 = ('DELETE FROM Chatter WHERE id = $1')
    const values4 = [user[0].id]
    res = await client.query(sql4, values4)
    res = await client.query('COMMIT')
    console.log(`user ${username} deleted successfully.`)
    return true
  } catch (error) {
    console.log(error)
    await client.query('ROLLBACK')
    return false
  }
}

const login = async (credentials) => {
  const sql = ('SELECT * FROM chatter WHERE username = $1;')
  const values = [credentials.username]
  try {
    const returnvalue = await client.query(sql, values)
    const validated = await validatePassword(credentials.password, returnvalue.rows[0].passhash)
    if (returnvalue.rowCount !== 1 || !validated){
      return false
    }
    const tokenVariables = {
      username: returnvalue.rows[0].username,
      id: returnvalue.rows[0].id
    }
    const token = await jwt.sign(tokenVariables, process.env.TOKENSECRET)
    let userInfo = {
      token: token,
      username: returnvalue.rows[0].username,
      id: returnvalue.rows[0].id,
      email: returnvalue.rows[0].email,
      images_id: returnvalue.rows[0].images_id
    }
    try {
      const inviteSql = ('SELECT invite.inviter AS inviter, room.name AS room, room.id AS room_id, chatter_id AS invitee_id\
            FROM invite FULL JOIN room ON invite.room_id = room.id WHERE invite.chatter_id = $1;')
      const inviteValues = [userInfo.id]
      const invites = await client.query(inviteSql, inviteValues)
      userInfo.invites = invites.rows
    } catch (error){
      console.log('Error in getting invitations')
    }
    return userInfo
  } catch (error) {
    return false
  }
}

const getUser = async (username) => {
  const sql = ('SELECT * FROM chatter WHERE username = $1;')
  const values = [username]
  const result = await client.query(sql, values)
  return result.rows
}

/*
Checks if desired chatnick is already registered.
Return true if available, false if reserved.
*/
const checkChatnickAwailability = async (chatnick) => {
  const sql = ('SELECT * FROM chatter WHERE username = $1;')
  const values = [chatnick]
  try {
    const returnvalue = await client.query(sql, values)
    if (returnvalue.rowCount !== 0){
      return false
    }
    return true
  } catch (error) {
    return false
  }
}

const getPublicRooms = async () => {
  const sql = ('SELECT * FROM room WHERE private = false;')
  try {
    const rooms = await client.query(sql)
    return rooms.rows.map(r => ({ ...r, full: false }))
  } catch (error) {
    console.log(error)
    return false
  }
}

const getPrivateRooms = async (id) => {
  const sql = ('SELECT * FROM room LEFT JOIN room_chatter ON room.id = room_chatter.room_id WHERE room_id IS NOT NULL AND chatter_id = $1;')
  const values = [id]
  try {
    const rooms = await client.query(sql, values)
    return rooms.rows
  } catch (error) {
    console.log(error)
    return false
  }
}

const getPrivateRoomUsers = async (rooms) => {
  const users = []
  for(let i=0;i<rooms.length;i++){
    const values = [ rooms[i].id ]
    const sql = 'SELECT id, username, email FROM Chatter JOIN room_chatter ON chatter.id = room_chatter.chatter_id WHERE Room_chatter.room_id = $1;'
    const result = await client.query(sql, values)
    const room = {
      id: rooms[i].id,
      name: rooms[i].name,
      description: rooms[i].description,
      owner_id: rooms[i].owner_id,
      user_limit: rooms[i].user_limit,
      full: false,
      users: result.rows
    }
    users.push(room)
  }
  return users
}

const searchForEmailOrUsername = async (searchPhrase) => {
  const sql = ('SELECT id FROM Chatter WHERE username = $1 OR email = $1')
  const values = [searchPhrase]
  const result = await client.query(sql, values)
  return result.rows.length === 1 ? result.rows[0].id : console.warn('No matching user found with phrase `',searchPhrase,'`.')
}

const insertInvitation = async (chatterId, roomId, inviter) => {
  try {
    const sql = ('INSERT INTO Invite(chatter_id, room_id, inviter) VALUES ($1, $2, $3)')
    const values = [chatterId, roomId, inviter]
    const result = await client.query(sql, values)
    return result.rowCount === 1 ? true : false
  } catch (error) {
    console.log('User is already invited to the room.')
    return false
  }
}

const removeInvitation = async (invitation) => {
  try {
    const sql = ('DELETE FROM Invite WHERE chatter_id = $1 AND room_id = $2 AND inviter = $3')
    const values = [invitation.invitee_id, invitation.room_id, invitation.inviter]
    const result = await client.query(sql, values)
    return result.rowCount === 1 ? true : false
  } catch (error) {
    console.log('Invitation not found.')
    return false
  }
}

const acceptInvitation = async (invitation) => {
  try {
    await client.query('BEGIN')
    const sql = ('DELETE FROM Invite WHERE chatter_id = $1 AND room_id = $2 AND inviter = $3')
    const values = [invitation.invitee_id, invitation.room_id, invitation.inviter]
    await client.query(sql, values)
    const sql2 = ('INSERT INTO Room_chatter (chatter_id, room_id) VALUES ($1, $2)')
    const values2 = [invitation.invitee_id, invitation.room_id]
    await client.query(sql2, values2)
    await client.query('COMMIT')
    return true
  } catch (error) {
    console.log('Error in accepting invitation.')
    return false
  }
}

const removeRoom = async (room, token) => {
  const verified = jwt.verify(token, process.env.TOKENSECRET)
  if (!verified.id || !token || verified.id !== room.owner_id){
    return false
  }
  try {
    await client.query('BEGIN')
    const sql2 = ('DELETE FROM Room_chatter WHERE room_id = $1')
    const values2 = [room.id]
    await client.query(sql2, values2)
    const sql3 = ('DELETE FROM Invite WHERE room_id = $1')
    const values3 = [room.id]
    await client.query(sql3, values3)
    const sql = ('DELETE FROM Room WHERE id = $1 AND owner_id = $2')
    const values = [room.id, room.owner_id]
    await client.query(sql, values)
    await client.query('COMMIT')
    return verified.id
  } catch (error) {
    console.log('Error in accepting invitation.')
    return false
  }
}

const searchForUserImagesId = async (username) => {
  const sql = ('SELECT images_id FROM Chatter WHERE username = $1')
  const values = [username]
  const result = await client.query(sql, values)
  return result.rowCount !== 0 ? result.rows[0].images_id : null
}

const updateImagesIdtoUser = async (username, images_id) => {
  const sql = ('UPDATE Chatter SET images_id = $1 WHERE username = $2')
  const values = [images_id, username]
  const result = await client.query(sql, values)
  return result.rowCount === 1 ? true : false
}

const updateUserInfo = async (updateInfo, token) => {
  if (!verificateAndValidate(updateInfo.username, token, updateInfo.password)){
    return false
  }
  if (updateInfo.newPassword.length > 0){
    const hash = await createHash(updateInfo.newPassword)
    const sql = ('UPDATE Chatter SET email = $1, passhash = $2 WHERE username = $3')
    const values = [updateInfo.email, hash, updateInfo.username]
    const result = await client.query(sql, values)
    if (result.rowCount !== 1){
      return false
    }
  }
  const sql = ('UPDATE Chatter SET email = $1 WHERE username = $2')
  const values = [updateInfo.email, updateInfo.username]
  const result = await client.query(sql, values)
  console.log(result)
  return result.rowCount === 1 ? true : false
}

const verificateAndValidate = async (username, token, password) => {
  const verified = jwt.verify(token, process.env.TOKENSECRET)
  if (!verified.id || !token){
    console.log(verified)
    console.log('verification failed')
    return false
  }
  const sql = ('SELECT * FROM chatter WHERE username = $1;')
  const values = [username]
  const returnvalue = await client.query(sql, values)
  const validated = await validatePassword(password, returnvalue.rows[0].passhash)
  if (returnvalue.rowCount !== 1 || !validated){
    console.log('validation failed')
    return false
  }
  return true
}

module.exports = {
  addNewUser,
  login,
  checkChatnickAwailability,
  addNewRoom,
  getPublicRooms,
  getPrivateRooms,
  getPrivateRoomUsers,
  searchForEmailOrUsername,
  insertInvitation,
  removeInvitation,
  acceptInvitation,
  removeRoom,
  searchForUserImagesId,
  updateImagesIdtoUser,
  getUser,
  updateUserInfo,
  removeUser,
  verificateAndValidate,
  createHash,
  validatePassword
}