require('dotenv').config()
const { Client } = require('pg')

let client

if (process.env.HEROKU){
  client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  })
} else {
  client = new Client()
}

const getConnection = async () => {
  console.log('Connecting to postgres')
  await client.connect()
  console.log('Connected to postgres')
}

const createTables = () => {
  client.query('CREATE TABLE IF NOT EXISTS room (id varchar(48) PRIMARY KEY, name varchar(64) NOT NULL UNIQUE, description varchar(255), private boolean NOT NULL, owner_id varchar(48), user_limit integer);')
    .catch(error => {
      console.log(error)
    })
  client.query('CREATE TABLE IF NOT EXISTS chatter (id varchar(48) PRIMARY KEY, username varchar(64) NOT NULL UNIQUE, email varchar(128) NOT NULL UNIQUE, passhash varchar(128) NOT NULL, images_id varchar(32));')
    .catch(error => {
      console.log(error.message)
    })
    // Allowed users for private rooms
  client.query('CREATE TABLE IF NOT EXISTS room_chatter (chatter_id varchar(48) NOT NULL, room_id varchar(48) NOT NULL, PRIMARY KEY (chatter_id, room_id), FOREIGN KEY (chatter_id) REFERENCES chatter(id), FOREIGN KEY (room_id) REFERENCES room(id));')
    .catch(error => {
      console.log(error.message)
    })
    // Invites to private rooms
  client.query('CREATE TABLE IF NOT EXISTS invite (chatter_id varchar(48) NOT NULL, room_id varchar(48) NOT NULL, inviter varchar(64) NOT NULL, PRIMARY KEY (chatter_id, room_id), FOREIGN KEY (chatter_id) REFERENCES chatter(id), FOREIGN KEY (room_id) REFERENCES room(id))')
    .catch(error => {
      console.log(error.message)
    })
  console.log('Postgres-tables OK')
}

module.exports = { getConnection, createTables, client }