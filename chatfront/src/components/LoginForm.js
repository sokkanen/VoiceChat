import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { setNotification } from '../reducers/NotificationReducer'
import { setUser } from '../reducers/UserReducer'
import { setChatnick } from '../reducers/ChatnickReducer'
import { setInvites } from '../reducers/InvitesReducer'
import { setUserInfo } from '../reducers/UserInfoReducer'
import { connect } from 'react-redux'
import Notification from './Notification'
import './Forms.css'

const LoginForm = (props) => {

    const errorfield = {
      background: "rgb(226, 122, 122)"
    }
      
    const field = {
      background: "rgb(240, 247, 247)"
    }

    const socket = props.socket

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [usernameField, setUsernameField] = useState(field)
    const [passwordField, setPasswordField] = useState(field)

    useEffect(() => {
        socket.on('login', (success, id, user) => {
            if (id === socket.id){
                loginValidator(success, user)
            }
        })

        return() => {
            socket.off('login')
        }
    }, [])

    const loginValidator = async (success, user) => {
        if (success){
            socket.emit('requestRooms', user.id)
            const welcome = `Welcome ${user.username}!`
            window.localStorage.setItem('user', JSON.stringify(user))
            props.setUser(user.username)
            props.setUserInfo(user.email)
            props.setChatnick(user.username)
            props.setInvites(user.invites)
            await notificate(welcome)
        } else {
            setUsernameField(errorfield)
            setPasswordField(errorfield)
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

    const notificate = (message) => {
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
        <Form onSubmit={handleLogin}>
        <h4 style={{border:'2px solid #8bc9e8', padding: '20px'}}>Login with credentials</h4>
            <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control value={username} onChange={handleUsername} placeholder="Enter username" style={usernameField} className="username"/>
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={handlePassword} placeholder="Enter Password" style={passwordField} className="password"/>
            </Form.Group>
            <Button variant="success" type="submit">
                Login
            </Button>
        </Form>
        </div>
    </div>
    )
}


const mapStateToProps = (state) => {
    return {
      notification: state.notification,
      room: state.room
    }
  }
  
  const mapDispatchToProps = {
    setNotification,
    setUser,
    setChatnick,
    setInvites,
    setUserInfo
  }
  
  const connectedLoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginForm)
  
  export default connectedLoginForm



