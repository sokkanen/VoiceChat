import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, ButtonToolbar, Form } from 'react-bootstrap'
import './Forms.css'

const UserManagement = (props) => {

  const username = props.user
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [email, setEmail] = useState(props.userInfo)

  const [passwordField, setPasswordField] = useState('field')
  const [newPasswordField, setNewPasswordField] = useState('field')
  const [newPassword2Field, setNewPassword2Field] = useState('field')
  const [emailField, setEmailField] = useState('field')
  const [confirmDisabled, setConfirmDisabled] = useState(true)
  const [confirmType, setConfirmType] = useState('outline-warning')

  const validate = () => {
    if (newPassword !== newPassword2){
        alert('Passwords must match')
        setNewPasswordField('error_field')
        setNewPassword2Field('error_field')
        return false
    } else if (newPassword.length < 5){
        alert('Password must be at least 5 characters long')
        setNewPasswordField('error_field')
        setNewPassword2Field('error_field')
        return false
    } else if (!email.includes('.') || !email.includes('@')) {
        alert('Invalid email-address')
        setEmailField('error_field')
        return false
    }
    setEmailField('field')
    setPasswordField('field')
    setNewPasswordField('field')
    setNewPassword2Field('field')
    return true 
  }

  const handlePassword = (event) => {
    if (event.target.value.length === 0){
      setConfirmType('outline-warning')
      setConfirmDisabled(true)
    } else {
      setConfirmType('warning')
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

  const field = {
    background: "rgb(208, 216, 216)"
  }

  const errorfield = {
    background: "rgb(226, 122, 122)"
  }

  const sendNewUserInfo = async (event) => {
    event.preventDefault()
    if (validate()){
        const updatedInfo = {
            username: username,
            newPassword: newPassword,
            email: email
        }
        //await socket.emit('newUserRegister', newUser)
    }
  }

  const deleteUser = () => {
    console.log('User deleted...')
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
                    <Form.Control value={username} disabled="true" style={field}/>
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" value={email} onChange={handleEmail} placeholder="Enter email" className={emailField}/>
                </Form.Group>
                <Form.Group controlId="newpassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" value={newPassword} onChange={handleNewPassword} placeholder="Enter new password" className={newPasswordField}/>
                </Form.Group>
                <Form.Group controlId="newpassword2">
                    <Form.Label>Retype New Password</Form.Label>
                    <Form.Control type="password" value={newPassword2} onChange={handleNewPassword2} placeholder="Retype new password" className={newPassword2Field}/>
                </Form.Group>
                <Form.Group style={{marginTop: "75px"}} controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={handlePassword} placeholder="Enter current password to update user information" className={passwordField}/>
                </Form.Group>
                <ButtonToolbar>
                  <Button style={{marginLeft: '5px', marginRight: '5px'}} type="submit" disabled={confirmDisabled} variant={confirmType}>Confirm changes</Button>
                  <Button style={{marginLeft: '5px', marginRight: '5px'}} onClick={deleteUser} variant="outline-danger">Remove user</Button>
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
}

const connectedUserManagement = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserManagement)

export default connectedUserManagement