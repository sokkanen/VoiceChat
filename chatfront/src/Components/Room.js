import React, { useState, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import Speech from 'speak-tts'
import { Spinner, ButtonToolbar, Dropdown, DropdownButton, Button, Badge, Form } from 'react-bootstrap'
import { setNotification } from '../Reducers/NotificationReducer'
import { setUsers, addUserToUsers, removeUserFromUsers } from '../Reducers/UsersReducer'
import { setLetter } from '../Reducers/LetterReducer'
import { setSpeaking } from '../Reducers/SpeakingReducer'
import { setTyping } from '../Reducers/UsersReducer'
import { newMessage } from '../Reducers/MessageReducer'
import { setRoom } from '../Reducers/RoomReducer'

import ChatText from './ChatText'
import Heads from './Heads'
import Notification from './Notification'

const Room = (props) => {

    const socket = props.socket
    const msg = props.message

    const [chatBoxVisible, setChatBoxVisible] = useState(true)
    const [buttonMsg, setButtonMsg] = useState('Hide textchat')
    const [speakButtonMsg, SetSpeakButtonMsg] = useState('Speak usernames')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [count, setCount] = useState(7)
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [textColor, setTextColor] = useState('#62f442')
    const [voices, setVoices] = useState([])
    const [speech, setSpeech] = useState(new Speech())
    const [voice, setVoice] = useState('Default')

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
          if (speakButtonMsg === 'Speak usernames'){
            speak(msg.message + '.')
          } else {
            speak(msg.user + ': ' + msg.message + '.')
          }
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
      socket.on('typing', (room, username, onOff) => {
        if (room === props.room){
          props.setTyping(username, onOff)
        }
      })
      return() => {
        socket.off('left')
        socket.off('join')
        socket.off('disconnected')
        socket.off('typing')
      }
    }, [props])

    // Speech

    const initializeSpeech = (voice) => async () => {
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
        setVoice(voice.name)
        window.alert(`Current voice changed to ${voice.name}`)
        console.log('Voice changed')
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

    const setSpeakingNicknames = () => {
      if (speakButtonMsg === 'Speak usernames'){
        SetSpeakButtonMsg(`Don't speak usernames`)
      } else {
        SetSpeakButtonMsg('Speak usernames')
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
      props.setTyping(props.chatnick, false)
      socket.emit('typing', props.room, props.chatnick, false)
    }

    const setUserTyping = () => {
      props.setTyping(props.chatnick, true)
      socket.emit('typing', props.room, props.chatnick, true)
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
          <ButtonToolbar>
            <DropdownButton id="dropdown-basic-button" title="Voice select">
              {voices.length !== 0 ? voices.map(voice => (
                <Dropdown.Item eventKey={voice.name + voice.lang} onClick={initializeSpeech(voice)} >{voice.name}</Dropdown.Item>
              )) : <Dropdown.Item>No voices found</Dropdown.Item>}
            </DropdownButton>
            <Button onClick={setVisible} variant="info">{buttonMsg}</Button>
            <Button onClick={setSpeakingNicknames} variant="primary">{speakButtonMsg}</Button>
          </ButtonToolbar>
          <h5>Voice: <Badge pill variant="secondary">{voice}</Badge></h5>
        </div>
        <div>
            <ChatText messages={messages} msgcount={count} visible={chatBoxVisible}/>
        <div>
            <Heads room={props.room}/>
        </div>
        <Form onSubmit={sendMessage}>
          <Form.Group>
            <Form.Label>Type your message</Form.Label>
            <Form.Control onClick={setUserTyping} type="text" placeholder="Your message" value={message} onChange={(event) => setMessage(event.target.value)}/>
          </Form.Group>
          <Button variant="primary" type="submit">Submit</Button>
        </Form>
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
  setRoom,
  setTyping
}

const connectedRoom = connect(mapStateToProps, mapDispatchToProps)(Room)

export default connectedRoom