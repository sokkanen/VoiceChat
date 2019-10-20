import React, { useState, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { Fade } from 'react-reveal'
import Speech from 'speak-tts'
import { 
  Spinner, 
  ButtonToolbar, 
  Dropdown, 
  DropdownButton, 
  Button, 
  Badge, 
  Form, 
  InputGroup, 
  FormControl, 
  OverlayTrigger,
  Popover,
  } from 'react-bootstrap'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { CompactPicker } from 'react-color'
import { setNotification } from '../reducers/NotificationReducer'
import { setUsers, addUserToUsers, removeUserFromUsers, setUserColor } from '../reducers/UsersReducer'
import { setLetter } from '../reducers/LetterReducer'
import { setSpeaking } from '../reducers/SpeakingReducer'
import { setTyping } from '../reducers/UsersReducer'
import { newMessage } from '../reducers/MessageReducer'
import { setRoom } from '../reducers/RoomReducer'

import ChatText from './ChatText'
import Heads from './Heads'
import Notification from './Notification'

const Room = (props) => {
    const socket = props.socket
    const msg = props.message

    const [chatBoxVisible, setChatBoxVisible] = useState(true)
    const [buttonMsg, setButtonMsg] = useState('Hide textchat')
    const [speakButtonMsg, SetSpeakButtonMsg] = useState('Speak usernames')
    const [largeChatButtonMessage, setLargeChatButtonMessage] = useState('Toggle small textchat')
    const [message, setMessage] = useState('')
    const [messageLastModified, setMessageLastModified] = useState(0)
    const [messages, setMessages] = useState([])
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [textColor, setTextColor] = useState('#62f442')
    const [voices, setVoices] = useState([])
    const [speech, setSpeech] = useState(new Speech())
    const [voice, setVoice] = useState('Default')
    const [largeChat, setLargeChat] = useState(true)

    useEffect(() => {
      if (msg.length !== 0){
        if (msg.room === props.room){
          console.log('message: ', msg.message, ' from: ', msg.user)
          const msgs = messages.reverse()
          const ms = {
            user: msg.user, 
            msg: msg.message
          }
          msgs.push(ms)
          setMessages(msgs.reverse())
          if (props.users.length > 0 ){
            const muted = props.users.find(user => user.chatnick === msg.user).muted
            if (!muted){
              if (speakButtonMsg === 'Speak usernames'){
                speak(msg.message + ' ')
              } else {
                speak(msg.user + ': ' + msg.message + ' ')
              }
            }
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
      socket.on('usercolor', (room, chatnick, color) => {
        if (room === props.room){
          props.setUserColor(chatnick, color)
        }
      })
      window.addEventListener("beforeunload", onUnload)

      const typeTimer = setInterval(() => {
        isStillTyping()
      }, 2000);

      return() => {
        socket.off('left')
        socket.off('join')
        socket.off('disconnected')
        socket.off('typing')
        socket.off('usercolor')
        socket.off('mute')
        window.removeEventListener("beforeunload", onUnload)
        clearInterval(typeTimer)
      }
    }, [props])

    const onUnload = (event) => {
      socket.emit('unload')
    }

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

    const setLarge = () => {
      setLargeChat(!largeChat)
      if (largeChatButtonMessage === 'Toggle large textchat'){
        setLargeChatButtonMessage('Toggle small textchat')
      } else {
        setLargeChatButtonMessage('Toggle large textchat')
      }
    }

    const sendMessage = async (event) => {
      event.preventDefault()
      if (message.length > 140){
        notificate(`Maximum length for message is 140 characters. Your message was ${message.length} characters long.`)
      } else if (message.length === 0){
        notificate(`Your message must contain at least one character.`)
      } else {
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
    }

    const isStillTyping = () => {
      const now = new Date().getTime()
        if (now - messageLastModified > 2000 && now - messageLastModified !== now){
          props.setTyping(props.chatnick, false)
          socket.emit('typing', props.room, props.chatnick, false)
        }
    }

    const setUserTyping = (value) => {
      props.setTyping(props.chatnick, value)
      socket.emit('typing', props.room, props.chatnick, value)
    }

    const handleMessageInput = (msg) => {
      const now = new Date().getTime()
      setMessageLastModified(now)
      setMessage(msg)
      setUserTyping(true)
    }

    const addEmoji = (emoji) => {
      setMessage(message + emoji.native)
    }

    const handleColorChange = (color) => {
      props.setUserColor(props.chatnick, color)
      socket.emit('usercolor', props.room, props.chatnick, color)
    }

    if (props.room === undefined){
        return <div><h4>Please choose a room from "Chatrooms"</h4></div>
    }

    const style = { 
      padding: 10,
      margin: 45,
    }

    const spinnerStyle = {
      display: 'block',
      'margin': `${window.innerHeight / 2}px`,
    }

    if (props.users.length === 0){
      return (
        <div style={spinnerStyle}>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )
    }

    return (

      <Fade bottom>
        <div style={style}>
              <div>
                  <Notification textColor={textColor}/>
              </div>
              <h1>{props.room}</h1>
          <div>
            <ButtonToolbar>
              <DropdownButton id="dropdown-basic-button" variant="outline-primary" title="Voice select">
                {voices.length !== 0 ? voices.map(voice => (
                  <Dropdown.Item key={voice.name + voice.lang} eventKey={voice.name + voice.lang} onClick={initializeSpeech(voice)} >{voice.name}</Dropdown.Item>
                )) : <Dropdown.Item>No voices found</Dropdown.Item>}
              </DropdownButton>
              <Button style={{marginLeft: '5px', marginRight: '5px'}} onClick={setSpeakingNicknames} variant="outline-primary">{speakButtonMsg}</Button>

              <OverlayTrigger trigger="focus" placement="bottom" overlay={colorPickerPopOver(handleColorChange)}>
              <Button style={{marginLeft: '5px', marginRight: '5px'}} variant="outline-primary">Select Bubble Color</Button>
              </OverlayTrigger>

              <Button style={{marginLeft: '5px', marginRight: '5px'}} onClick={setVisible} variant="outline-info">{buttonMsg}</Button>
              <Button style={{marginLeft: '5px', marginRight: '5px'}} onClick={setLarge} variant="outline-info">{largeChatButtonMessage}</Button>
            </ButtonToolbar>
            <h5>Voice: <Badge pill variant="secondary">{voice}</Badge></h5>
          </div>
          <div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div>
                  <ChatText messages={messages} largeChat={largeChat} visible={chatBoxVisible} users={props.users}/>
                  {chatBoxVisible ? 
                    <Form onSubmit={sendMessage}>
                    <InputGroup>
                    <InputGroup.Prepend>
                      <OverlayTrigger trigger="click" placement="right" overlay={emojiPopOver(addEmoji)}>
                        <Button variant="outline-info">Emojis</Button>
                      </OverlayTrigger>
                    </InputGroup.Prepend>
                        <FormControl
                          type="text" 
                          placeholder="Your message" 
                          className="submit-form"
                          value={message} 
                          onChange={(event) => handleMessageInput(event.target.value)}
                        />
                    <InputGroup.Append>
                        <Button variant="success" type="submit">Send</Button>
                    </InputGroup.Append>
                    </InputGroup>
                    </Form>
                    : null
                  }
                </div>
                  <div>
                    <Heads room={props.room}/>
                    {!chatBoxVisible ? 
                      <Form onSubmit={sendMessage} className="submit-form">
                      <InputGroup>
                      <InputGroup.Prepend>
                        <OverlayTrigger trigger="click" placement="right" overlay={emojiPopOver(addEmoji)}>
                          <Button variant="outline-info">Emojis</Button>
                        </OverlayTrigger>
                      </InputGroup.Prepend>
                          <FormControl
                            type="text" 
                            placeholder="Your message" 
                            className="submit-form"
                            value={message} 
                            onChange={(event) => handleMessageInput(event.target.value)}
                          />
                      <InputGroup.Append>
                          <Button variant="success" type="submit">Send</Button>
                      </InputGroup.Append>
                      </InputGroup>
                      </Form>
                      : null
                    }
                  </div>
              </div>
        </div>
        </div>
      </Fade>
    )
}

const emojiPopOver = (handler) => {
  return (
    <Popover id="popover">
      <Popover.Content>
        <Picker onSelect={handler} title='Skintone picker' emoji='point_right'/>
      </Popover.Content>
    </Popover>
  )
}

const colorPickerPopOver = (handler) => {
  return (
    <Popover id="popover">
    <Popover.Content>
      <CompactPicker onChange={handler}/>
    </Popover.Content>
    </Popover>
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
  setTyping,
  setUserColor
}

const connectedRoom = connect(mapStateToProps, mapDispatchToProps)(Room)

export default connectedRoom