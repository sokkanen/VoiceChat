const client = require('socket.io-client')

const socket = client('ws://localhost:3003', {
  'reconnection delay': 0,
  'reopen delay': 0,
  'force new connection': true,
  transports: ['websocket'],
})

const connect = async (done) => {
  if (!socket.connected){
    await socket.on('connect', () => {
      done()
    })
  }
  done()
}

const disconnect = () => {
  if (socket.connected) {
    socket.disconnect()
  }
}

module.exports = { socket, connect, disconnect }