import React from 'react'
import './Chatroom.css'

const Chatrooms = () => {

    const createNew = (event) => {
        event.preventDefault()
        alert('New room created')
        console.log('Hello')
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
                        <textarea name="description" rows="5" cols="30"></textarea>
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
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Chatrooms