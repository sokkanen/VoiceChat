import React from 'react'
import './Chatrooms.css'

const NewRoomForm = () => {

    const createNew = (event) => {
        event.preventDefault()
        alert(`New room '${event.target.title.value}' was created!`)
        event.target.title.value = ''
    }

    return (
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
    )
}

export default NewRoomForm




