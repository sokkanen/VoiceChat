import React from 'react'
import { connect } from 'react-redux'
import './Forms.css'

const NewRoomForm = (props) => {

    const socket = props.socket
    const visible = props.visible

    const createNew = async (event) => {
        event.preventDefault()
        if (validate(event.target)){
            const room = {
                title: event.target.title.value,
                description: event.target.description.value,
                private: event.target.private.value === 'YES' ? true : false,
                user_limit: event.target.user_limit.value
            }
            event.target.title.value = ''
            event.target.description.value = ''
            event.target.private.value = 'NO'
            event.target.user_limit.value = '5'
            if (room.title === ''){
                alert(`New room must have a title!`)
            } else {
                const usr = {
                    name: props.user,
                    token: JSON.parse(window.localStorage.getItem('user')).token
                }
                await socket.emit('newRoom', room, usr)
                socket.emit('requestRooms', JSON.parse(window.localStorage.getItem('user')).id)
            }
        }
    }

    const validate = (target) => {
        const title = target.title.value
        const description = target.description.value
        if (title.length < 5 || title.length > 128){
            alert('Room title must be between 5 and 128 characters')
            return false
        } else if (description.length > 256){
            alert('Maximum length for description is 256 characters.')
            return false
        }
        return true
    }

    if (!visible){
        return <div></div>
    }

    if (props.user === ''){
        return (
            <form className="user-form" onSubmit={createNew}>
                <div className="field">
                    <h4>Please register to create a new chatroom!</h4>
                </div>
            <div className="field">
                <button disabled={true} type="submit">Create</button>
            </div>
        </form>
        )
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
                    <label>Additional information:</label>
                    <textarea name="description" rows="5" cols="50"></textarea>
                </div>
                <div className="button_field">
                    <label>Private:</label>
                    <input type="radio" name="private" value="YES"></input> Yes
                    <input type="radio" name="private" value="NO" defaultChecked></input> No
                </div>
                <div className="button_field">
                    <label>User limit:</label>
                    <input type="radio" name="user_limit" value="2"></input> 2
                    <input type="radio" name="user_limit" value="5" defaultChecked></input> 5
                    <input type="radio" name="user_limit" value="10"></input> 10
                    <input type="radio" name="user_limit" value="999"></input> Unlimited
                </div>
                <div className="field">
                    <button type="submit">Create</button>
                </div>
            </form>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      user: state.user
    }
  }
  
  const connectedNewRoomForm = connect(mapStateToProps, null)(NewRoomForm)
  
  export default connectedNewRoomForm



