/* eslint-disable indent */
/* eslint-disable no-undef */
const server = require('../socketService')
let socket = require('./clientMock')

beforeAll((done) => {
  jest.setTimeout(7000)
  jest.spyOn(console, 'log').mockImplementation(() => {})
  server.listen()
  done()
})

afterAll((done) => {
  server.stopServer()
  console.log.mockRestore()
  done()
})

afterEach((done) => {
  socket.disconnect()
  console.log.mockClear()
  done()
})

beforeEach((done) => {
  socket.connect(done)
})

describe('tests socket.io', () => {

  test('client connects', (done) => {
    setTimeout(() => {
      expect(console.log.mock.calls.length).toBe(2)
      expect(console.log).toHaveBeenCalledWith('Client connected')
      done()
    }, 200)
  })

  test('client disconnects', (done) => {
    setTimeout(() => {
      expect(console.log.mock.calls.length).toBe(2)
      expect(console.log).toHaveBeenCalledWith('Client disconnected')
      done()
    }, 200)
  })
})

