import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import { setNotification } from '../reducers/NotificationReducer'
import Notification from './Notification'
import './Forms.css'

const errorfield = {
    background: "rgb(226, 122, 122)"
}
    
const field = {
    background: "rgb(240, 247, 247)"
}

const NewUserForm = (props) => {

    const socket = props.socket

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [email, setEmail] = useState('')
    const [usernameField, setUsernameField] = useState(field)
    const [passwordField, setPasswordField] = useState(field)
    const [password2Field, setPassword2Field] = useState(field)
    const [emailField, setEmailField] = useState(field)

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
            setUsernameField(errorfield)
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

    const notificate = (message) => {
        props.setNotification(message)
        setTimeout(() => {
          props.setNotification('')
        }, 5000)
    }

    const validate = () => {
        if (password !== password2){
            alert('Passwords must match')
            setPasswordField(errorfield)
            setPassword2Field(errorfield)
            return false
        } else if (password.length < 5){
            alert('Password must be at least 5 characters long')
            setPasswordField(errorfield)
            setPassword2Field(errorfield)
            return false
        } else if (!email.includes('.') || !email.includes('@')) {
            alert('Invalid email-address')
            setEmailField(errorfield)
            return false
        } else if (username.length < 3 || username.length > 15){
            alert('Username must be between 3 and 15 characters.')
            setUsernameField(errorfield)
            return false
        }
        setUsernameField(field)
        setEmailField(field)
        setPasswordField(field)
        setPassword2Field(field)
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

    const style = { 
        padding: 10,
        margin: 45
    }

    return (
        <div>
        <div style={style}>
            <Notification textColor="#62f442"/>
        </div>
            <div style={{border:'5px solid #cecece', padding: '20px', backgroundColor: '#dfe7eb'}}>
            <Form onSubmit={createNew}>
            <h4 style={{border:'2px solid #8bc9e8', padding: '20px'}}>New User Registration</h4>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control value={username} onChange={handleUsername} placeholder="Enter username" style={usernameField} className="username"/>
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" value={email} onChange={handleEmail} placeholder="Enter email" style={emailField} className="email"/>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={handlePassword} placeholder="Enter Password" style={passwordField} className="password"/>
                </Form.Group>
                <Form.Group controlId="password2">
                    <Form.Label>Retype Password</Form.Label>
                    <Form.Control type="password" value={password2} onChange={handlePassword2} placeholder="Re-Enter Password" style={password2Field} className="password2"/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
            </div>
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




