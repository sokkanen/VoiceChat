import React, { useState, useEffect } from 'react'
import './Chatrooms.css'
import NewRoomForm from './NewRoomForm'
import Notification from './Notification'

const Chatrooms = ({ socket, Link, rooms }) => {
    const [visible, setVisible] = useState(false)
    const [newRoomText, setNewRoomText] = useState('Create a New Room')
    const [notification, setNotification] = useState('')
    const [textColor, setTextColor] = useState('#62f442')
  
    useEffect(() => {
      socket.on('error', (msg) => {
        if (msg.id === socket.id){
          setTextColor('#ed1f10')
          notificate(msg.message)
        }
      })
    }, [])

    const newRoomVisible = () => {
        setVisible(!visible)
        if (newRoomText === 'Create a New Room'){
            setNewRoomText('Close room creation')
        } else {
            setNewRoomText('Create a New Room')
        }
    }

    const notificate = (message) => {
        setNotification(message)
        setTimeout(() => {
          setNotification('')
          setTextColor('#62f442')
        }, 5000)
    }

    return (
        <div>
            <div>
                <Notification notification={notification} textColor={textColor}/>
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
                        {rooms.map(r => 
                        <tr key={r.title}>
                            <td>
                                <Link to={`/rooms/${r.title}`}>{r.title}</Link>
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

export default Chatrooms