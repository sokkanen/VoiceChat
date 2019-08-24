import React, { useState, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import Speech from 'speak-tts'
import { Spinner, ButtonToolbar, Dropdown, DropdownButton } from 'react-bootstrap'
import { setNotification } from '../Reducers/NotificationReducer'
import { setUsers, addUserToUsers, removeUserFromUsers } from '../Reducers/UsersReducer'
import { setLetter } from '../Reducers/LetterReducer'
import { setSpeaking } from '../Reducers/SpeakingReducer'
import { newMessage } from '../Reducers/MessageReducer'
import { setRoom } from '../Reducers/RoomReducer'

import ChatText from './ChatText'
import Heads from './Heads'
import Notification from './Notification'

const Room = (props) => {

    const socket = props.socket
    const msg = props.message

    //let speech = new Speech()

    const [chatBoxVisible, setChatBoxVisible] = useState(true)
    const [buttonMsg, setButtonMsg] = useState('Hide textchat')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [count, setCount] = useState(7)
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [textColor, setTextColor] = useState('#62f442')
    const [voices, setVoices] = useState([])
    const [speech, setSpeech] = useState(new Speech())

    useEffect(() => {
      if (msg.length !== 0){
        if (msg.room === props.room){
          console.log('message: ', msg.message, ' from: ', msg.user)
          const msgs = messages
          const ms = {
            user: msg.user, 
            msg: msg.message
          }
          msgs.push(ms)
          if (msgs.length > count){
            msgs.shift()
          }
          setMessages(msgs)
          speak(msg.message + '.')
          props.setSpeaking(msg.user)
          forceUpdate()
          props.newMessage('')
        }
      }
      socket.on('disconnected', async (user) => {
        if (props.room !== null && user !== null){
          if (user.room === props.room){
            props.removeUserFromUsers(user.id)
            const ms = `User '${user.chatnick}' disconnected.`
            notificate(ms)
          }
        }
      })
      socket.on('left', (user) => {
        if (user.oldroom === props.room){
          props.removeUserFromUsers(user.id)
          const ms = `User '${user.chatnick}' changed room.`
          notificate(ms)
        }
      })
      socket.on('join', (newUser) => {
        if (props.room !== null){
          if (newUser.room === window.localStorage.getItem('room')){
            props.addUserToUsers(newUser)
            const ms = `User '${newUser.chatnick}' joined room.`
            notificate(ms)
          }
        }
      })
      return() => {
        socket.off('left')
        socket.off('join')
        socket.off('disconnected')
      }
    }, [props])

    // Speech

    const initializeSpeech = (voice) => async () => {
      console.log(voice)
      const sph = new Speech()
      try {
        await sph.init({
          'volume': 1,
          'lang': voice.lang,
          'rate': 1,
          'pitch': 1,
          'voice': voice.name,
        })
        setSpeech(sph)
        console.log('Done')
      } catch (error) {
        console.log(error)
      }
    }

    speechSynthesis.onvoiceschanged = () => {
      setVoices(speechSynthesis.getVoices())
      console.log('Voices set.')
    }

    const speak = (msg) => {
        speech.speak({
          text: msg,
          queue: true,
          listeners: {
              onend: () => {
                props.setLetter('.')
              } 
          }
        })
        for (let i = 0; i < msg.length; i++){
          setTimeout(() => {
            props.setLetter(msg.charAt(i))
          }, 105 * i);
        }
        props.setLetter('1')
    }

    // /Speech

    const notificate = (message) => {
      props.setNotification(message)
      setTimeout(() => {
        props.setNotification('')
        setTextColor('#62f442')
      }, 5000)
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
      const msg = {
          user: props.chatnick,
          message: message,
          room: props.room
      }
      await socket.emit('newMessage', msg)
      setMessage('')
    }

    if (props.room === undefined){
        return <div><h4>Please choose a room from "Chatrooms"</h4></div>
    }

    const style = { 
      padding: 10,
      margin: 45
    }

    if (props.users.length === 0){
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )
    }

    return (
        <div style={style}>
            <div>
                <Notification textColor={textColor}/>
            </div>
            <h1>{props.room}</h1>
        <div>
            <ChatText messages={messages} msgcount={count} visible={chatBoxVisible}/>
            <button onClick={setVisible}>{buttonMsg}</button>
        <div>
            <Heads room={props.room}/>
        </div>

        <ButtonToolbar>
        <DropdownButton id="dropdown-basic-button" title="Voice select">
          {voices.map(voice => (
            <Dropdown.Item eventKey={voice.name} onClick={initializeSpeech(voice)} >{voice.name}</Dropdown.Item>
          ))}
        </DropdownButton>
      </ButtonToolbar>

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
    letter: state.letter,
    message: state.message,
    chatnick: state.chatnick,
    room: state.room
  }
}

const mapDispatchToProps = {
  setNotification,
  setUsers,
  addUserToUsers,
  removeUserFromUsers,
  setLetter,
  setSpeaking,
  newMessage,
  setRoom
}

const connectedRoom = connect(mapStateToProps, mapDispatchToProps)(Room)

export default connectedRoom