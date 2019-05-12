import React, { useState, useEffect, useReducer } from 'react';
import openSocket from 'socket.io-client'
import ChatText from './ChatText'
import defaultFace from './1default.png'

const socket = openSocket('http://localhost:3003/')

const App = () =>  {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [count, setCount] = useState(5)
  const [chatBoxVisible, setChatBoxVisible] = useState(true)
  const [buttonMsg, setButtonMsg] = useState('Hide textchat')
  const [user, setUser] = useState('')
  const [img, setImg] = useState(defaultFace)
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    socket.on('message', (msg) => {
      console.log('new received message: ', msg)
      const msgs = messages
      msgs.push(msg)
      if (msgs.length > count){
        msgs.shift()
      }
      setMessages(msgs)
      Speak(msg)
      forceUpdate()
    })
  }, [])

  const sendMessage = async (event) => {
    event.preventDefault()
    await socket.emit('newMessage', (user + ': ' + message))
    setMessage('')
  }

  const Speak = (msg) => {
    const xx = msg.split(':')
    console.log('MOI')
    for (let i = 1; i < xx[1].length; i++){
      console.log(xx[1].charAt(i))
    }
  }

  const setCurrentUser = (event) => {
    event.preventDefault()
    setUser(event.target.username.value)
    event.target.username.value = ''
  }

  const setVisible = () => {
    setChatBoxVisible(!chatBoxVisible)
    if (buttonMsg === 'Hide textchat'){
      setButtonMsg('Show textchat')
    } else {
      setButtonMsg('Hide textchat')
    }
  }

  return (
    <div>
      <div>
      <form onSubmit={setCurrentUser}>
        <input type="text" name="username"/>
        <button type="submit">Set User</button>
      </form>
      Current user: <b>{user}</b>
      </div>
      <ChatText messages={messages} msgcount={count} visible={chatBoxVisible}/>
      <button onClick={setVisible}>{buttonMsg}</button>
      <div>
        <img src={img}></img>
      </div>
      <form onSubmit={sendMessage}>
        <input type="text" value={message} onChange={(event) => setMessage(event.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App
