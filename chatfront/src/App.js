import React, { useState, useEffect, useReducer } from 'react';
import openSocket from 'socket.io-client'
import Speech from 'speak-tts'
import ChatText from './ChatText'
import Heads from './Components/Heads'
import Notification from './Components/Notification'

const socket = openSocket('http://localhost:3003/')
const speech = new Speech()

const App = () =>  {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [count, setCount] = useState(5)
  const [chatBoxVisible, setChatBoxVisible] = useState(true)
  const [buttonMsg, setButtonMsg] = useState('Hide textchat')
  const [user, setUser] = useState('Anonymous')
  const [letter, setLetter] = useState('')
  const [voices, setVoices] = useState('') // Talteen äänenvalintaa varten.
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const [notification, setNotification] = useState('')
  const [textColor, setTextColor] = useState('')
  const [users, setUsers] = useState([])
  const [speaking, setSpeaking] = useState('')

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
      const splittedMsg = msg.split(':')
      speak(splittedMsg[1])
      setSpeaking(splittedMsg[0])
      forceUpdate()
    })
    socket.on('changedUsername', (changeInfo) => {
        setNotification(`'${changeInfo.oldUsername}' changed username to '${changeInfo.newUserName}'`)
        setTextColor('#62f442')
        setTimeout(() => {
          setNotification('')
        }, 5000)
    })
    socket.on('newUser', (username) => {
        setNotification(`'${username}' joined chat.`)
        setTextColor('#62f442')
        setTimeout(() => {
          setNotification('')
        }, 5000)
    })
    socket.on('disconnected', (username) => {
      setNotification(`User '${username}' disconnected.`)
      setTextColor('#62f442')
      setTimeout(() => {
        setNotification('')
      }, 5000);
    })
    socket.on('users', (changedUsers) => {
      setUsers(changedUsers)
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
    speech.speak({
      text: msg,
      queue: true,
      listeners: {
          onend: () => {
            setLetter('')
          } 
      }
    })
    for (let i = 1; i < msg.length; i++){
      setTimeout(() => {
        setLetter(msg.charAt(i))
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
        <div>
          <Notification notification={notification} textColor={textColor}/>
        </div>
      <form onSubmit={setCurrentUser}>
        <input type="text" name="username"/>
        <button type="submit">Set User</button>
      </form>
      Current user: <b>{user}</b>
      </div>
      <ChatText messages={messages} msgcount={count} visible={chatBoxVisible}/>
      <button onClick={setVisible}>{buttonMsg}</button>
      <div>
        <Heads speaking={speaking} users={users} letter={letter}/>
      </div>
      <form onSubmit={sendMessage}>
        <input type="text" value={message} onChange={(event) => setMessage(event.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App
