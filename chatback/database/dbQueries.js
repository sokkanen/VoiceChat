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
    if (!verified.id || !user.token){
        return false
    }
    await client.query("BEGIN;") // Beginning transaction
    const sql = ("INSERT INTO room (id, name, description, private, owner_id) values ($1, $2, $3, $4, $5)")
    const id = uuid()
    const values = [id, room.title, room.description, room.private, verified.id]
    await client.query(sql, values)
    if (room.private){
        const sql2 = ("INSERT INTO room_chatter (chatter_id, room_id) values ($1, $2)")
        const values2 = [verified.id, id]
        await client.query(sql2, values2)
    }
    try {
        await client.query("COMMIT;") // Commiting transaction
    } catch (error){
        console.log(error)
        return false
    }
    return true
}

const addNewUser = async (username, email, password) => {
    const id = uuid()
    const passhash = createHash(password)
    const sql = ("INSERT INTO chatter (id, username, email, passhash) VALUES ($1, $2, $3, $4);")
    const values = [id, username, email, passhash]
    try {
        await client.query(sql, values)
        return true
    } catch (error) {
        return false
    }
}

const login = async (credentials) => {
    const sql = ("SELECT * FROM chatter WHERE username = $1;")
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
        const userInfo = {
            token: token,
            username: returnvalue.rows[0].username,
            id: returnvalue.rows[0].id
        }
        return userInfo
    } catch (error) {
        return false
    }
}

const checkChatnickAwailability = async (chatnick) => {
    const sql = ("SELECT * FROM chatter WHERE username = $1;")
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
    const sql = ("SELECT * FROM room WHERE private = false;")
    try {
        const rooms = await client.query(sql)
        return rooms.rows
    } catch (error) {
        console.log(error)
        return false
    }
}

const getPrivateRooms = async (id) => {
    const sql = ("SELECT id, name, description, private, owner_id FROM room LEFT JOIN room_chatter ON room.id = room_id WHERE room_id IS NOT NULL AND chatter_id = $1;")
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
    for(i=0;i<rooms.length;i++){
        const values = [ rooms[i].id ]
        const sql = `SELECT id, username FROM Chatter JOIN room_chatter ON chatter.id = room_chatter.chatter_id WHERE Room_chatter.room_id = $1;`
        const result = await client.query(sql, values)
        room = {
            id: rooms[i].id,
            name: rooms[i].name,
            //description: rooms[i].description,
            //owner_id: rooms[i].owner_id,
            users: result.rows
        }
        users.push(room)
    }
    console.log(users)
    return users
}

module.exports = { addNewUser, login, checkChatnickAwailability, addNewRoom, getPublicRooms, getPrivateRooms, getPrivateRoomUsers }