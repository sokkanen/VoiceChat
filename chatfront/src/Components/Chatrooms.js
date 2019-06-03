import React, { useState, useEffect } from 'react'
import './Chatrooms.css'
import NewRoomForm from './NewRoomForm'

const Chatrooms = ({socket, rooms}) => {
    const [visible, setVisible] = useState(false)
    const [newRoomText, setNewRoomText] = useState('Create a New Room')

    const newRoomVisible = () => {
        setVisible(!visible)
        if (newRoomText === 'Create a New Room'){
            setNewRoomText('Close')
        } else {
            setNewRoomText('Create a New Room')
        }
    }

    return (
        <div>
            <NewRoomForm socket={socket} visible={visible}/>
            <button onClick={newRoomVisible}>{newRoomText}</button>
            <h2>Rooms</h2>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Join</th>
                        </tr>
                        {rooms.map(r => 
                        <tr>
                            <td>{r.title}</td>
                            <td>{r.description}</td>
                            <td><button>Join</button></td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Chatrooms