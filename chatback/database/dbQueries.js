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
        }
        return userInfo
    } catch (error) {
        return false
    }
}

module.exports = { addNewUser, login }