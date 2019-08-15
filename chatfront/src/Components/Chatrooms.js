import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../Reducers/NotificationReducer'
import { setRoom } from '../Reducers/RoomReducer'
import { setRooms } from '../Reducers/RoomsReducer'
import { setPrivateRooms } from '../Reducers/PrivateRoomsReducer'
import { setChatnick} from '../Reducers/ChatnickReducer'
import { setInviteStatus } from '../Reducers/InviteStatusReducer'
import { setUsers } from '../Reducers/UsersReducer'
import InvitePopUp from './InvitePopUp'
import './Forms.css'
import NewRoomForm from './NewRoomForm'
import Notification from './Notification'

const Chatrooms = (props) => {
    const [visible, setVisible] = useState(false)
    const [newRoomText, setNewRoomText] = useState('Create a New Room')
    const [textColor, setTextColor] = useState('#62f442')

    const socket = props.socket
    const Link = props.Link
  
    useEffect(() => {
      if (props.user){
        socket.emit('requestRooms', JSON.parse(window.localStorage.getItem('user')).id)
      } else {
        socket.emit('requestRooms')
      }
      socket.on('error', (msg) => {
        if (msg.id === socket.id){
          setTextColor('#ed1f10')
          notificate(msg.message)
        }
      })
      socket.on('room', (room, roomUsers) => {
        props.setRoom(room)
        window.localStorage.setItem('room', room)
        props.setUsers(roomUsers)
      })
      socket.on('rooms', (rooms, privateRooms) => {
        props.setRooms(rooms)
        props.setPrivateRooms(privateRooms)
      })
      socket.on('checkChatnick', (available, id, chatnick) => {
          if (id === socket.id){
              if (available){
                props.setChatnick(chatnick)
              } else {
                alert(`${chatnick} not available. Please try another.`)
              }
          }
      }) 
    socket.on('invitation', (values) => {
    if (values.id === socket.id){
        if (values.success === true){
            props.setInviteStatus("User invited")
            setTimeout(() => {
                props.setInviteStatus("")
            }, 2500);
        } else {
            props.setInviteStatus("User not found or user already invited to the room.")
            setTimeout(() => {
                props.setInviteStatus("")
            }, 2500);
        }
    }
    })
    socket.on('updatedPrivateRooms', (updatedRooms) => {
        props.setPrivateRooms(updatedRooms)
    })
      return() => {
        socket.off('error')
        socket.off('rooms')
        socket.off('checkChatnick')
        socket.off('invitation')
        socket.off('updatedPrivateRooms')
      }

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
        const registered = props.user !== "" ? true : false
        const joinRoomInfo = {
            id: socket.id,
            chatnick: props.chatnick,
            room: event.target.name,
            oldroom: window.localStorage.getItem('title'),
            registered: registered
        }
        socket.emit('roomJoin', joinRoomInfo)
    }

    const setChatNickname = (event) => {
        event.preventDefault()
        socket.emit('checkChatnick', event.target.chatnick.value)
        event.target.chatnick.value = ''
    }

    const removeRoom = (room) => () => {
        if (window.confirm(`Do you really want to remove ${room.name}`)){
            const token = JSON.parse(window.localStorage.getItem('user')).token
            socket.emit('removeRoom', room, token)
        }
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
            <h2>Public rooms</h2>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                        {props.rooms.map(r =>
                        <tr key={r.id}>
                            <td onClick={joinRoomHandler}>
                                <Link name={r.name} to={`/rooms/${r.name}`}>{r.name}</Link>
                            </td>
                            <td>{r.description}</td>
                            <td>{props.user ? r.owner_id === JSON.parse(window.localStorage.getItem('user')).id ? 
                            <button onClick={removeRoom(r)}>Remove room</button> 
                            : 
                            null
                            : null}</td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {props.user ?
            <div>
                <h2>{props.chatnick}'s Private rooms</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Users</th>
                        </tr>
                        {props.privateRooms.map(r =>
                        <tr key={r.name}>
                            <td onClick={joinRoomHandler}>
                                <Link name={r.name} to={`/rooms/${r.name}`}>{r.name}</Link>
                            </td>
                            <td>{r.description}</td>
                            <td><InvitePopUp currentRoom={r} socket={socket}/></td>
                            <td>{props.user ? r.owner_id === JSON.parse(window.localStorage.getItem('user')).id ? 
                            <button onClick={removeRoom(r)}>Remove room</button> 
                            : null
                            : null}</td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
            : null }
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
                        {props.rooms.map(r => <tr key={r.name}><td><p>{r.name}</p></td><td>{r.description}</td></tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      rooms: state.rooms,
      privateRooms: state.privateRooms,
      notification: state.notification,
      room: state.room,
      chatnick: state.chatnick,
      user: state.user,
      users: state.users
    }
  }

  const mapDispatchToProps = {
    setNotification,
    setRoom,
    setRooms,
    setPrivateRooms,
    setChatnick,
    setInviteStatus,
    setUsers
  }
  
  const connectedChatRooms = connect(mapStateToProps, mapDispatchToProps)(Chatrooms)
  
  export default connectedChatRooms