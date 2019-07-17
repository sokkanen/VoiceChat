import React, { useState, useEffect } from 'react'
import { setNotification } from '../Reducers/NotificationReducer'
import { connect } from 'react-redux'
import Notification from './Notification'
import './Forms.css'

const NewUserForm = (props) => {

    const socket = props.socket

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [email, setEmail] = useState('')
    const [usernameField, setUsernameField] = useState('field')
    const [passwordField, setPasswordField] = useState('field')
    const [password2Field, setPassword2Field] = useState('field')
    const [emailField, setEmailField] = useState('field')

    useEffect(() => {
        socket.on('newUserRegister', (success, id, username) => {
            if (id === socket.id){
                usernameValidator(success, username)
            }
        })
    }, [])

    const usernameValidator = async (success, name) => {
        if (success){
            const welcome = `Welcome ${name}!`
            await notificate(welcome)
            setUsername('')
            setPassword('')
            setPassword2('')
            setEmail('')
        } else {
            alert('Please choose another username')
            setUsernameField('error_field')
            setUsername('')
        }
    }

    const createNew = async (event) => {
        event.preventDefault()
        if (validate()){
            const newUser = {
                username: username,
                password: password,
                email: email
            }
            await socket.emit('newUserRegister', newUser)
        }
    }

    const notificate = (message) => { // TÄMÄ REDUCERIIN!
        props.setNotification(message)
        setTimeout(() => {
          props.setNotification('')
        }, 5000)
    }

    const validate = () => {
        if (password !== password2){
            alert('Passwords must match')
            setPasswordField('error_field')
            setPassword2Field('error_field')
            return false
        } else if (password.length < 5){
            alert('Password must be at least 5 characters long')
            setPasswordField('error_field')
            setPassword2Field('error_field')
            return false
        } else if (!email.includes('.') || !email.includes('@')) {
            alert('Invalid email-address')
            setEmailField('error_field')
            return false
        }
        setUsernameField('field')
        setEmailField('field')
        setPasswordField('field')
        setPassword2Field('field')
        return true
        
    }

    const handleUsername = (event) => {
        setUsername(event.target.value)
    }

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    const handlePassword2 = (event) => {
        setPassword2(event.target.value)
    }

    const handleEmail = (event) => {
        setEmail(event.target.value)
    }

    return (
        <div>
            <div>
            <Notification textColor="#62f442"/>
            </div>
            <form className="user-form" onSubmit={createNew}>
                <div className="field">
                <h4>Register</h4>
                </div>
                <div className={usernameField}>
                    <label>Username:</label>
                    <input value={username} onChange={handleUsername}></input>
                </div>
                <div className={emailField}>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={handleEmail}></input>
                </div>
                <div className={passwordField}>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePassword}></input>
                </div>
                <div className={password2Field}>
                    <label>Retype Password:</label>
                    <input type="password" value={password2} onChange={handlePassword2}></input>
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
    setNotification
  }
  
  const connectedNewUserForm = connect(mapStateToProps, mapDispatchToProps)(NewUserForm)
  
  export default connectedNewUserForm




