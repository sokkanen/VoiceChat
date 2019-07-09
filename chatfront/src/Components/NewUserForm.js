import React from 'react'
import './Chatrooms.css'

const NewUserForm = ({socket}) => {

    const createNew = async (event) => {
        event.preventDefault()
        if (event.target.password.value !== event.target.password2.value){
            alert('Passwords must match')
        } else {
            const newUser = {
                username: event.target.username.value,
                password: event.target.password.value,
            }
    
            event.target.username.value = ''
            event.target.password.value = ''
            event.target.password2.value = ''
    
            await socket.emit('newUserRegister', newUser)
        }
    }

    return (
        <div>
            <form className="user-form" onSubmit={createNew}>
                <div className="field">
                <h4>Register</h4>
                </div>
                <div className="field">
                    <label>Username:</label>
                    <input name="username"></input>
                </div>
                <div className="field">
                    <label>Password:</label>
                    <input type="password" name="password"></input>
                </div>
                <div className="field">
                    <label>Retype Password:</label>
                    <input type="password" name="password2"></input>
                </div>
                <div className="field">
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    )
}

export default NewUserForm




