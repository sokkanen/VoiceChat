import React, { useEffect, useState } from 'react'
import './Chatrooms.css'

const Chatrooms = (socket) => {

    const loading = [{title: 'loading...', description: ''}]
    const [rooms, setRooms] = useState(loading)

    const createNew = (event) => {
        event.preventDefault()
        alert(`New room '${event.target.title.value}' was created!`)
        event.target.title.value = ''
    }

    return (
        <div>
            <div>
                <form className="user-form" onSubmit={createNew}>
                    <div className="field">
                    <h4>Create a new room</h4>
                    </div>
                    <div className="field">
                        <label>Name:</label>
                        <input name="title"></input>
                    </div>
                    <div className="field">
                        <label>Description:</label>
                        <textarea name="description" rows="5" cols="50"></textarea>
                    </div>
                    <div className="field">
                        <button type="submit">Create</button>
                    </div>
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