import React from 'react'
import './Chatrooms.css'

// TULEE NÄKYMÄÄN VAIN REKISTERÖITYNEILLE KÄYTTÄJILLE!

const NewRoomForm = ({socket, visible}) => {

    const createNew = async (event) => {
        event.preventDefault()
        const room = {
            title: event.target.title.value,
            description: event.target.description.value,
            private: event.target.private.value,
        }
        event.target.title.value = ''
        event.target.description.value = ''
        event.target.private.value = 'NO'
        if (room.title === ''){
            alert(`New room must have a title!`)
        } else {
            await socket.emit('newRoom', room)
        }
    }

    if (!visible){
        return <div></div>
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
                    <label>Private:</label>
                    <input type="radio" name="private" value="YES"></input> Yes
                    <input type="radio" name="private" value="NO" defaultChecked></input> No
                </div>
                <div className="field">
                    <button type="submit">Create</button>
                </div>
            </form>
        </div>
    )
}

export default NewRoomForm




