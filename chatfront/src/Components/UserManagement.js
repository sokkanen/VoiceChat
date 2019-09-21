import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, ButtonToolbar, Form } from 'react-bootstrap'
import { setUsers } from '../Reducers/UsersReducer'
import { logoutUser } from '../Reducers/UserReducer'
import { removeChatnick } from '../Reducers/ChatnickReducer'
import { removePrivateRooms } from '../Reducers/PrivateRoomsReducer'
import { setRoom } from '../Reducers/RoomReducer'
import { removeUserInfo } from '../Reducers/UserInfoReducer'
import './Forms.css'

const errorfield = {
  background: "rgb(226, 122, 122)"
}

const field = {
  background: "rgb(240, 247, 247)"
}

const UserManagement = (props) => {

  const username = props.user
  const socket = props.socket
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [email, setEmail] = useState(props.userInfo)

  const [passwordField, setPasswordField] = useState(field)
  const [newPasswordField, setNewPasswordField] = useState(field)
  const [newPassword2Field, setNewPassword2Field] = useState(field)
  const [emailField, setEmailField] = useState(field)
  const [confirmDisabled, setConfirmDisabled] = useState(true)
  const [confirmType, setConfirmType] = useState('outline-warning')
  const [deleteType, setDeleteType] = useState('outline-danger')

  const validate = () => {
    if (newPassword !== newPassword2){
        alert('Passwords must match')
        setNewPasswordField(errorfield)
        setNewPassword2Field(errorfield)
        return false
    } else if (newPassword.length < 5 && newPassword.length > 0){
        alert('Password must be at least 5 characters long')
        setNewPasswordField(errorfield)
        setNewPassword2Field(errorfield)
        return false
    } else if (!email.includes('.') || !email.includes('@')) {
        alert('Invalid email-address')
        setEmailField(errorfield)
        return false
    }
    setEmailField(field)
    setPasswordField(field)
    setNewPasswordField(field)
    setNewPassword2Field(field)
    return true 
  }

  const handlePassword = (event) => {
    if (event.target.value.length === 0){
      setConfirmType('outline-warning')
      setDeleteType('outline-danger')
      setConfirmDisabled(true)
    } else {
      setConfirmType('warning')
      setDeleteType('danger')
      setConfirmDisabled(false)
    }
      setPassword(event.target.value)
  }

  const handleNewPassword = (event) => {
      setNewPassword(event.target.value)
  }

  const handleNewPassword2 = (event) => {
    setNewPassword2(event.target.value)
  }

  const handleEmail = (event) => {
      setEmail(event.target.value)
  }


  const style = { 
    padding: 10,
    margin: 45
  }

  const sendNewUserInfo = async (event) => {
    event.preventDefault()
    if (validate()){
        const updatedInfo = {
            username: username,
            password: password,
            newPassword: newPassword,
            email: email
        }
        const token = JSON.parse(window.localStorage.getItem('user')).token
        socket.emit('userUpdate', updatedInfo, token)
        setPassword('')
        setNewPassword('')
        setNewPassword2('')
        setConfirmDisabled(true)
    }
  }

  const deleteUser = async () => {
    if (window.confirm('Are you sure, you want to remove you account?')){
      if (window.confirm('All your information, pictures, rooms, etc. will be removed.')){
        const token = await JSON.parse(window.localStorage.getItem('user')).token
        props.logoutUser()
        props.removeChatnick()
        props.removePrivateRooms()
        props.setUsers([])
        props.setRoom('')
        props.removeUserInfo()
        await socket.emit('logout')
        await socket.emit('deleteUser', username, token, password)
        window.localStorage.removeItem('user')
      }
    }
  }

    return (
      <div style={style}>
        <div>
          <h1>User management</h1>
        </div>
        <div style={{border:'5px solid #cecece', padding: '20px', backgroundColor: '#dfe7eb'}}>
            <Form onSubmit={sendNewUserInfo}>
            <h4 style={{border:'2px solid #8bc9e8', padding: '20px'}}>User information</h4>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control value={username} disabled={true} style={{background: "rgb(208, 216, 216)"}}/>
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" value={email} onChange={handleEmail} placeholder="Enter email" style={emailField}/>
                </Form.Group>
                <Form.Group controlId="newpassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" value={newPassword} onChange={handleNewPassword} placeholder="Enter new password" style={newPasswordField}/>
                </Form.Group>
                <Form.Group controlId="newpassword2">
                    <Form.Label>Retype New Password</Form.Label>
                    <Form.Control type="password" value={newPassword2} onChange={handleNewPassword2} placeholder="Retype new password" style={newPassword2Field}/>
                </Form.Group>
                <Form.Group style={{marginTop: "75px"}} controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={handlePassword} placeholder="Enter current password to update user information" style={passwordField}/>
                </Form.Group>
                <ButtonToolbar>
                  <Button style={{marginLeft: '5px', marginRight: '5px'}} type="submit" disabled={confirmDisabled} variant={confirmType}>Confirm changes</Button>
                  <Button style={{marginLeft: '5px', marginRight: '5px'}} onClick={deleteUser} disabled={confirmDisabled} variant={deleteType}>Remove user</Button>
                </ButtonToolbar>
            </Form>
            </div>
      </div>

    )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = {
  setUsers,
  logoutUser,
  removeChatnick,
  removePrivateRooms,
  setRoom,
  removeUserInfo,
}

const connectedUserManagement = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserManagement)

export default connectedUserManagement