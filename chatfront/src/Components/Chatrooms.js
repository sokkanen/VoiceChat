import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../Reducers/NotificationReducer'
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
      socket.on('error', (msg) => {
        if (msg.id === socket.id){
          setTextColor('#ed1f10')
          notificate(msg.message)
        }
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
            room: event.target.name
        }
        socket.emit('roomJoin', joinRoomInfo)
    }

    return (
        <div>
            <div>
                <Notification textColor={textColor}/>
            </div>
                <NewRoomForm socket={socket} visible={visible}/>
            <button onClick={newRoomVisible}>{newRoomText}</button>
            <h2>Rooms</h2>
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

const mapStateToProps = (state) => {
    return {
      rooms: state.rooms,
      notification: state.notification
    }
  }

  const mapDispatchToProps = {
    setNotification,
  }
  
  const connectedChatRooms = connect(mapStateToProps, mapDispatchToProps)(Chatrooms)
  
  export default connectedChatRooms