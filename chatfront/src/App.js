import React, { useState, useEffect, useReducer } from 'react';
import openSocket from 'socket.io-client'

const socket = openSocket('http://localhost:3003/')

const App = () =>  {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    socket.on('message', (msg) => {
      console.log('new received message: ', msg)
      const msgs = messages
      msgs.push(msg)
      if (msgs.length > 5){
        msgs.shift()
      }
      setMessages(msgs)
      forceUpdate()
    })
  }, [])

  const sendMessage = async (event) => {
    event.preventDefault()
    await socket.emit('newMessage', (message))
    setMessage('')
  }

  return (
    <div>
      <ul>
        {messages.map(msg => <li key={msg}>{msg}</li>)}
      </ul>
      <form onSubmit={sendMessage}>
        <input type="text" value={message} onChange={(event) => setMessage(event.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
