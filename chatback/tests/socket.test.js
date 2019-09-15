/* eslint-disable indent */
/* eslint-disable no-undef */
const server = require('../socketService')
const client = require('socket.io-client')
let socket

beforeAll((done) => {
  jest.setTimeout(30000)
  server.listen()
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  done()
})

afterAll((done) => {
  server.stopServer()
  done()
})

afterEach((done) => {
  if (socket.connected) {
    socket.disconnect()
  }
  done()
})

beforeEach((done) => {
    socket = client('http://localhost:3003', {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket'],
    })
    socket.on('connect', () => {
        done()
    })
})

describe('tests socket.io', () => {
  test('client connects', async () => {
    jest.setTimeout(2500)
    expect(global.console.log).toHaveBeenCalledWith('Client connected')
  })
})