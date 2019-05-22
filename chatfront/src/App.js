import React, { useState, useEffect, useReducer } from 'react';
import openSocket from 'socket.io-client'
import Speech from 'speak-tts'
import ChatText from './ChatText'
import Head from './Components/Head'

const socket = openSocket('http://localhost:3003/')
const speech = new Speech()

const App = () =>  {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [count, setCount] = useState(5)
  const [chatBoxVisible, setChatBoxVisible] = useState(true)
  const [buttonMsg, setButtonMsg] = useState('Hide textchat')
  const [user, setUser] = useState('')
  const [letter, setLetter] = useState('')
  const [voices, setVoices] = useState('') // Talteen äänenvalintaa varten.
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    initializeSpeech()
    socket.on('message', (msg) => {
      console.log('new received message: ', msg)
      const msgs = messages
      msgs.push(msg)
      if (msgs.length > count){
        msgs.shift()
      }
      setMessages(msgs)
      speak(msg)
      forceUpdate()
    })
  }, [])

  const initializeSpeech = () => {
    speech.init().then((data) => {
      console.log('Speech is ready ')
      const vc = data.voices.map(v => v.name)
      setVoices(vc)
    }).catch(error => {
      console.log(error)
    })
  }

  const sendMessage = async (event) => {
    event.preventDefault()
    await socket.emit('newMessage', (user + ': ' + message))
    setMessage('')
  }

  const speak = (msg) => {
    const xx = msg.split(':')
    speech.speak({
      text: xx[1],
      queue: true,
      listeners: {
          onend: () => {
            setLetter('')
          } 
      }
    })
    for (let i = 1; i < xx[1].length; i++){
      setTimeout(() => {
        setLetter(xx[1].charAt(i))
      }, 100 * i);
    }
    setLetter('')
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
        <Head letter={letter} user={user}/>
      </div>
      <form onSubmit={sendMessage}>
        <input type="text" value={message} onChange={(event) => setMessage(event.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App
