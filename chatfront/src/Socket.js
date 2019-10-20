import io from 'socket.io-client';

const LOCAL = 'ws://localhost:3003'
const HOST = window.location.origin.replace(/^http/, 'ws')
let socket
window.location.origin === 'http://localhost:3000' ? 
socket = io(LOCAL, {transports: ['websocket'], upgrade: false}) : 
socket = io(HOST, {transports: ['websocket'], upgrade: false})

export default socket