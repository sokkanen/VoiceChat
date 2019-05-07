import React, { useState, useEffect } from 'react';
import openSocket from 'socket.io-client'

const socket = openSocket('http://localhost:3003/')

function App() {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket.on('message', (msg) => {
      console.log(msg)
      setMessage(msg)
      const msgs = messages
      msgs.push(msg)
      if (msgs.length > 5){
        msgs.shift()
      }
      setMessages(msgs)
    })
  }, [])

  const addMessage = (event) => {
    event.preventDefault()
    const msgs = messages
    msgs.push(message)
    if (msgs.length > 5){
      msgs.shift()
    }
    setMessages(msgs)
    setMessage('')
  }

  return (
    <div>
      <ul>
        {messages.map(msg => <li key={msg}>{msg}</li>)}
      </ul>
      <form onSubmit={addMessage}>
        <input type="text" value={message} onChange={(event) => setMessage(event.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
