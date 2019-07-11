require('dotenv').config()
const { Client } = require('pg')

const client = new Client()

const getConnection = async () => {
    console.log('Connecting to postgres')
    await client.connect()
    console.log('Connected to postgres')
}

const createTables = () => {
    client.query("CREATE TABLE IF NOT EXISTS room (id varchar(48) PRIMARY KEY, name varchar(64) NOT NULL UNIQUE, owner varchar(64));")
    .then(result => {
        console.log(result.command)
    })
    .catch(error => {
        console.log(error)
    })
    client.query("CREATE TABLE IF NOT EXISTS chatter (id varchar(48) PRIMARY KEY, username varchar(64) NOT NULL UNIQUE, email varchar(128) NOT NULL, passhash varchar(128) NOT NULL );")
    .then(result => {
        console.log(result.command)
    })
    .catch(error => {
        console.log(error.message)
    })
    client.query("CREATE TABLE IF NOT EXISTS room_chatter (chatter_id varchar(64) NOT NULL, room_id varchar(64) NOT NULL, PRIMARY KEY (chatter_id, room_id), FOREIGN KEY (chatter_id) REFERENCES chatter(id), FOREIGN KEY (room_id) REFERENCES room(id));")
    .then(result => {
        console.log(result.command)
    })
    .catch(error => {
        console.log(error.message)
    })
    client.query("CREATE TABLE IF NOT EXISTS invite (chatter_id varchar(64) NOT NULL, room_id varchar(64) NOT NULL, PRIMARY KEY (chatter_id, room_id), FOREIGN KEY (chatter_id) REFERENCES chatter(id), FOREIGN KEY (room_id) REFERENCES room(id))")
    .then(result => {
        console.log(result.command)
    })
    .catch(error => {
        console.log(error.message)
    })
}

module.exports = { getConnection, createTables, client }