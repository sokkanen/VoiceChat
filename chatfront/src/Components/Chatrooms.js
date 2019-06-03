import React, { useEffect, useState } from 'react'
import './Chatrooms.css'
import NewRoomForm from './NewRoomForm'

const Chatrooms = (socket) => {

    const loading = [{title: 'loading...', description: ''}]
    const [rooms, setRooms] = useState(loading)

    return (
        <div>
            <NewRoomForm/>
            <h2>Rooms</h2>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                        {rooms.map(r => 
                        <tr>
                            <td>{r.title}</td>
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