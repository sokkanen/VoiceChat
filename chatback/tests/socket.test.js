/* eslint-disable indent */
/* eslint-disable no-undef */
const server = require('../socketService')
const db = require('../database/dbQueries')
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

describe('tests validation functions', () => {

  test('passhash is returned', () => {
    const hash = db.createHash('12345')
    expect(hash.length).toBe(60)
  })

  test('password validation is working with correct password', async () => {
    const hash = db.createHash('12345')
    expect(hash.length).toBe(60)
    const validated = await db.validatePassword('12345', hash)
    expect(validated).toBe(true)
  })

  test('password validation return false with incorrect password', async () => {
    const hash = db.createHash('12345')
    expect(hash.length).toBe(60)
    const validated = await db.validatePassword('123456', hash)
    expect(validated).toBe(false)
  })

})



