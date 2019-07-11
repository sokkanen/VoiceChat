const uuid = require('uuid/v1')
const bcrypt = require('bcrypt')
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

const addNewUser = async (username, email, password) => {
    const id = uuid()
    const passhash = createHash(password)
    const sql = ("INSERT INTO chatter (id, username, email, passhash) VALUES ($1, $2, $3, $4);")
    const values = [id, username, email, passhash]
    try {
        await client.query(sql, values)
        console.log('New user inserted')
        return true
    } catch (error) {
        return false
    }
}

module.exports = { addNewUser }