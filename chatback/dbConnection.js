require('dotenv').config()
const { Client } = require('pg')
const bcrypt = require('bcrypt')

const client = new Client()

const getConnection = async () => {
    console.log('Connecting to postgres')
    await client.connect()
    console.log('Connected to postgres')
}

module.exports = { getConnection }