import React, { useState, useEffect } from 'react'
import { setNotification } from '../Reducers/NotificationReducer'
import { setUser } from '../Reducers/UserReducer'
import { connect } from 'react-redux'
import Notification from './Notification'
import './Chatrooms.css'

const LoginForm = (props) => {

    const socket = props.socket

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [usernameField, setUsernameField] = useState('field')
    const [passwordField, setPasswordField] = useState('field')

    useEffect(() => {
        socket.on('login', (success, id, user) => {
            if (id === socket.id){
                loginValidator(success, user)
            }
        })
    }, [])

    const loginValidator = async (success, user) => {
        if (success){
            const welcome = `Welcome ${user.username}!`
            window.localStorage.setItem('user', JSON.stringify(user))
            props.setUser(user.username)
            await notificate(welcome)
            setUsername('')
            setPassword('')
        } else {
            setUsernameField('error_field')
            setPasswordField('error_field')
            setUsername('')
            setPassword('')
            alert('Wrong username or password')
        }
    }

    const handleLogin = async (event) => {
        event.preventDefault()
            const credentials = {
                username: username,
                password: password,
            }
            await socket.emit('login', credentials)
    }

    const notificate = (message) => { // TÄMÄ REDUCERIIN!
        props.setNotification(message)
        setTimeout(() => {
          props.setNotification('')
        }, 5000)
    }

    const handleUsername = (event) => {
        setUsername(event.target.value)
    }

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    return (
        <div>
            <div>
            <Notification textColor="#62f442"/>
            </div>
            <form className="user-form" onSubmit={handleLogin}>
                <div className="field">
                <h4>Login</h4>
                </div>
                <div className={usernameField}>
                    <label>Username</label>
                    <input value={username} onChange={handleUsername}></input>
                </div>
                <div className={passwordField}>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePassword}></input>
                </div>
                <div className="field">
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
      notification: state.notification,
    }
  }
  
  const mapDispatchToProps = {
    setNotification,
    setUser
  }
  
  const connectedLoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginForm)
  
  export default connectedLoginForm



