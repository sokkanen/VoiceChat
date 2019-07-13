import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../Reducers/NotificationReducer'
import { setRoom } from '../Reducers/RoomReducer'
import { setRooms } from '../Reducers/RoomsReducer'
import { setChatnick} from '../Reducers/ChatnickReducer'
import './Chatrooms.css'
import NewRoomForm from './NewRoomForm'
import Notification from './Notification'

const Chatrooms = (props) => {
    const [visible, setVisible] = useState(false)
    const [newRoomText, setNewRoomText] = useState('Create a New Room')
    const [textColor, setTextColor] = useState('#62f442')

    const socket = props.socket
    const Link = props.Link
  
    useEffect(() => {
      socket.emit('requestUsers')
      socket.emit('requestRooms')

      socket.on('error', (msg) => {
        if (msg.id === socket.id){
          setTextColor('#ed1f10')
          notificate(msg.message)
        }
      })
      socket.on('room', (room, id) => {
          if (id === socket.id){
            props.setRoom(room)
          }
      })
      socket.on('rooms', (rooms) => {
        props.setRooms(rooms)
      })
    },[])

    const newRoomVisible = () => {
        setVisible(!visible)
        if (newRoomText === 'Create a New Room'){
            setNewRoomText('Close room creation')
        } else {
            setNewRoomText('Create a New Room')
        }
    }

    const notificate = (message) => {
        props.setNotification(message)
        setTimeout(() => {
          props.setNotification('')
          setTextColor('#62f442')
        }, 5000)
    }

    const joinRoomHandler = (event) => {
        event.preventDefault()
        const joinRoomInfo = {
            id: socket.id,
            chatnick: props.chatnick,
            room: event.target.name,
            oldroom: window.localStorage.getItem('title')
        }
        socket.emit('roomJoin', joinRoomInfo)
    }


    const setChatNickname = (event) => {
        event.preventDefault()
        props.setChatnick(event.target.chatnick.value)
        event.target.chatnick.value = ''
      }

    if (props.chatnick !== ''){
        return (
        <div>
            <div>
                <Notification textColor={textColor}/>
            </div>
            <div>
                <NewRoomForm socket={socket} visible={visible}/>
                <button onClick={newRoomVisible}>{newRoomText}</button>
            </div>
            <h2>Rooms</h2>
            <h3>{props.chatnick}</h3>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                        {props.rooms.map(r =>
                        <tr key={r.title}>
                            <td onClick={joinRoomHandler}>
                                <Link name={r.title} to={`/rooms/${r.title}`}>{r.title}</Link>
                            </td>
                            <td>{r.description}</td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        )
    }

    return (
        <div>
            <div>
                <Notification textColor={textColor}/>
            </div>
            <div>
            <form onSubmit={setChatNickname}>
                <input type="text" name="chatnick"/>
                <button type="submit">Set Nickname</button>
            </form>
            </div>
            <h2>Rooms</h2>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                        {props.rooms.map(r => <tr key={r.title}><td><p>{r.title}</p></td><td>{r.description}</td></tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      rooms: state.rooms,
      notification: state.notification,
      room: state.room,
      chatnick: state.chatnick,
      user: state.user
    }
  }

  const mapDispatchToProps = {
    setNotification,
    setRoom,
    setRooms,
    setChatnick
  }
  
  const connectedChatRooms = connect(mapStateToProps, mapDispatchToProps)(Chatrooms)
  
  export default connectedChatRooms