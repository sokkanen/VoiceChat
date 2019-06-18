import React, { useState, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import Speech from 'speak-tts'
import { setNotification } from '../Reducers/NotificationReducer'
import { setUser } from '../Reducers/UserReducer'
import { setUsers } from '../Reducers/UsersReducer'
import { setLetter } from '../Reducers/LetterReducer'

import ChatText from '../ChatText'
import Heads from './Heads'
import Notification from './Notification'

const Room = (props) => {

    const room = props.room
    const socket = props.socket
    //const users = props.users.filter(u => u.room === room)

    const speech = new Speech()
    const [chatBoxVisible, setChatBoxVisible] = useState(true)
    const [buttonMsg, setButtonMsg] = useState('Hide textchat')
    const [speaking, setSpeaking] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [count, setCount] = useState(5)
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [voices, setVoices] = useState('') // Talteen äänenvalintaa varten.
    const [textColor, setTextColor] = useState('#62f442')

    useEffect(() => {
        initializeSpeech()
        if (room){
            window.localStorage.setItem('title', room.title)
        }
        socket.on('message', (msg) => {
            if (msg.room.title === window.localStorage.getItem('title')){
                console.log('message: ', msg.message, ' from: ', msg.user)
                const msgs = messages
                const ms = msg.user + ': ' + msg.message
                msgs.push(ms)
                if (msgs.length > count){
                  msgs.shift()
                }
                setMessages(msgs)
                speak(msg.message)
                setSpeaking(msg.user)
                forceUpdate()
            } else {
                console.log('Message to some other room')
            }
        }) 
        socket.on('changedUsername', (changeInfo) => {
            if (changeInfo.room === window.localStorage.getItem('title')){
              const ms = `'${changeInfo.oldUsername}' changed username to '${changeInfo.newUserName}'`
              notificate(ms)
            }
          })
          socket.on('newUser', (user) => {
            if (user.room === window.localStorage.getItem('title')){
              const ms = `'${user.name}' joined chat.`
              notificate(ms)
            }
          })
          socket.on('disconnected', (user) => {
            if (user.room === window.localStorage.getItem('title')){
              const ms = `User '${user.name}' disconnected.`
              notificate(ms)
            }
          })
          socket.on('users', (changedUsers) => {
            const roomUsers = changedUsers.filter(u => u.room === window.localStorage.getItem('title'))
            console.log(roomUsers)
            props.setUsers(roomUsers)
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

    const notificate = (message) => {
        props.setNotification(message)
        setTimeout(() => {
          props.setNotification('')
          setTextColor('#62f442')
        }, 5000)
    }

    const speak = (msg) => {
        speech.speak({
          text: msg,
          queue: true,
          listeners: {
              onend: () => {
                props.setLetter('')
              } 
          }
        })
        for (let i = 1; i < msg.length; i++){
          setTimeout(() => {
            props.setLetter(msg.charAt(i))
          }, 100 * i);
        }
        props.setLetter('')
    }

    const setCurrentUser = (event) => {
      event.preventDefault()
      props.setUser(event.target.username.value)
      const userInfo = {
          name: event.target.username.value,
          room: window.localStorage.getItem('title')
      }
      socket.emit('newUserName', userInfo)
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

    const sendMessage = async (event) => {
        event.preventDefault()
        if (props.user === 'Anonymous'){
            alert('Please choose a username before messaging')
        } else {
            const msg = {
                user: props.user,
                message: message,
                room: room
            }
            await socket.emit('newMessage', msg)
            setMessage('')
        }
    }

    if (room === undefined){
        return <div>loading...</div>
    }

    return (
        <div>
            <div>
                <Notification textColor={textColor}/>
            </div>
            <h1>{room.title}</h1>
        <div>
        <div>
            <form onSubmit={setCurrentUser}>
                <input type="text" name="username"/>
                <button type="submit">Set Username</button>
            </form>
        </div>
            <ChatText messages={messages} msgcount={count} visible={chatBoxVisible}/>
            <button onClick={setVisible}>{buttonMsg}</button>
        <div>
            <Heads speaking={speaking}/>
        </div>
        <form onSubmit={sendMessage}>
          <input type="text" value={message} onChange={(event) => setMessage(event.target.value)}/>
          <button type="submit">Send</button>
        </form>
      </div>
      </div>
    )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
    user: state.user,
    users: state.users,
    letter: state.letter
  }
}

const mapDispatchToProps = {
  setNotification,
  setUser,
  setUsers,
  setLetter
}

const connectedRoom = connect(mapStateToProps, mapDispatchToProps)(Room)

export default connectedRoom