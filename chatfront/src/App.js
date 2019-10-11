import React, { useEffect } from 'react';
import io from 'socket.io-client';
import {BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Nav, Navbar, Badge, Button } from 'react-bootstrap'
import { Fade } from 'react-reveal'
import { setRooms, setFullRooms } from './reducers/RoomsReducer'
import { newMessage } from './reducers/MessageReducer'
import { setUsers } from './reducers/UsersReducer'
import { setInvites } from './reducers/InvitesReducer'
import { logoutUser, setUser } from './reducers/UserReducer'
import { removeChatnick, setChatnick } from './reducers/ChatnickReducer'
import { removePrivateRooms } from './reducers/PrivateRoomsReducer'
import { setRoom } from './reducers/RoomReducer'
import { removeUserInfo, setUserInfo } from './reducers/UserInfoReducer'
import { setWindow } from './reducers/WindowSizeReducer'
import { setFaces } from './reducers/OwnFaceReducer'
import { initialize } from './images/Converter'
import Invites from './components/Invites'
import backGroundImage from './images/home.png'
import userImage from './images/user.png'

import Chatrooms from './components/Chatrooms'
import Room from './components/Room'
import NewUserForm from './components/NewUserForm'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Ownface from './components/Ownface'
import UserManagement from './components/UserManagement'

const LOCAL = 'ws://localhost:3003'
const HOST = window.location.origin.replace(/^http/, 'ws')
let socket
window.location.origin === 'http://localhost:3000' ? 
socket = io(LOCAL, {transports: ['websocket'], upgrade: false}) : 
socket = io(HOST, {transports: ['websocket'], upgrade: false})

const App = (props) =>  {

  if (window.localStorage.getItem('user')){
    const userData = JSON.parse(window.localStorage.getItem('user'))
    props.setUser(userData.username)
    props.setChatnick(userData.username)
    props.setUserInfo(userData.email)
    props.setInvites(userData.invites)
  }

  useEffect(() => {
    socket.emit('requestRooms')
    socket.on('message', (msg) => {
      props.newMessage(msg)
    })
    socket.on('imagesSaved', (value) => {
      value === true 
      ? window.alert('Your photos are successfully saved!')
      : window.alert('Error in saving your photos. Please try again.')
    })
    socket.on('room', (room, roomUsers) => {
      props.setRoom(room)
      window.localStorage.setItem('room', room)
      props.setUsers(roomUsers)
    })
    socket.on('full', (fullRooms) => {
      props.setFullRooms(fullRooms)
    })
    socket.on('userUpdate', (result, email) => {
      if (result === false){
        window.alert('Verification failed. User information not updated.')
      } else {
        props.setUserInfo(email)
        window.alert('User information updated successfully.')
      }
    })
    socket.on('deleteUser', (result) => {
      if (result === true){
        window.alert('User account deleted successfully.')
      } else {
        window.alert('Verification failed. User account not deleted.')
      }
    })
  }, [])

  const handleResize = () => {
    const values = {
      height: window.innerHeight,
      width: window.innerWidth
    }
    props.setWindow(values)
  }

  window.addEventListener('resize', handleResize)

  const roomByTitle = (title) => props.rooms.find(r => r.title === title)

  const style = { 
    padding: 10,
    background: "#6b7574",
    color: "white",
    fontWeight: "bold"
  }

  const styleToRight = { 
    padding: 10,
    background: "#6b7574",
    color: "white",
    fontWeight: "bold",
    marginRight: "50px"
  }

  const logOutHandler = () => {
    props.logoutUser()
    props.removeChatnick()
    props.removePrivateRooms()
    props.setUsers([])
    props.setRoom('')
    props.removeUserInfo()
    socket.emit('logout')
    window.localStorage.removeItem('user')
  }

  const faces = initialize().then((faces) => {
    props.setFaces(faces)
  })
  

  if (props.user){
    return (
      <div className="container">
        <Router>
          <Navbar bg="light" expand="lg">
              <Nav className="navbar fixed-top navbar-expand-md" style={style}>
                <div>
                  <Link style={style} to="/">
                    <img alt="" src={backGroundImage} width="30" height="30" className="d-inline-block align-top"/>
                  </Link>
                  <Link style={styleToRight} to="/rooms">Chatrooms</Link>
                    <img alt="" src={userImage} width="30" height="30" className="d-inline-block align-top"/> :
                  <Link style={style} to="/usrmngmt">{props.user}</Link>
                  <Link style={style} to="/alterface">Custom chatface</Link>
                  <Invites socket={socket}/>
                  <Button variant="outline-warning" style={{marginLeft: '5px'}}onClick={logOutHandler}>LogOut</Button> 
                </div>
              </Nav>
          </Navbar>

            <Route exact path="/" render={() => <Fade big><Home/></Fade>}/>
            <Route path="/alterface" render={() =>  <Fade big><Ownface socket={socket}/></Fade>}/>
            <Route path="/login" render={() => props.user === '' ? 
              <LoginForm socket={socket}/> : <Redirect to="/rooms"/>
              }/>
            <Route exact path="/rooms" render={() => <Fade big><Chatrooms socket={socket} Link={Link} /></Fade>}/>
            <Route exact path="/rooms/:title" render={({ match }) => 
              props.chatnick === '' ? <Redirect to="/rooms"/> :
              <Fade big><Room room={roomByTitle(match.params.title)} socket={socket}/></Fade>
            }/>
            <Route path="/usrmngmt" render={() => <Fade big><UserManagement socket={socket}/></Fade>}/>
        </Router>
        <footer className="blockquote-footer">
        <nav className="navbar fixed-bottom navbar-expand-md" style={style}> 
            <em>Joel Sokkanen 2019</em>
        </nav>
        </footer>
      </div>
    )
  }

  return (
      <div className="container">
        <Router>

      <Navbar bg="light" expand="lg">
        <Nav className="navbar fixed-top navbar-expand-md" style={style}>
          <div>
            <div>
              <Link style={style} to="/">
                <img alt="" src={backGroundImage} width="30" height="30" className="d-inline-block align-top"/>
              </Link>
              <Link style={style} to="/rooms">Chatrooms</Link>
              <Link style={style} to="/register">New User</Link>
              <Link style={styleToRight} to="/login">Login</Link>
              Nickname: <Badge variant="info">{props.chatnick ? props.chatnick : 'None'}</Badge>
            </div>
          </div>
        </Nav>
      </Navbar>

      <div className="container">
        <Route exact path="/" render={() => <Fade big><Home/></Fade>}/>
        <Route path="/register" render={() => <Fade big><NewUserForm socket={socket}/></Fade>}/>
        <Route path="/alterface" render={() => <Fade big><Home/></Fade>}/>
        <Route path="/login" render={() => props.user === '' ? 
        <Fade big><LoginForm socket={socket}/></Fade>: <Redirect to="/rooms"/>
        }/>
        <Route exact path="/rooms" render={() => <Fade big><Chatrooms socket={socket} Link={Link} /></Fade>}/>
        <Route exact path="/rooms/:title" render={({ match }) => 
          props.chatnick === '' ? <Redirect to="/rooms"/> :
          <Fade big><Room room={roomByTitle(match.params.title)} socket={socket}/></Fade>
        }/>
        <Route path="/usrmngmt" render={() => <Fade big><Home/></Fade>}/>
      </div>
        
        </Router>
        <footer className="blockquote-footer">
        <nav className="navbar fixed-bottom navbar-expand-md" style={style}> 
            <em>Joel Sokkanen 2019</em>
        </nav>
        </footer>
      </div>
    
  )
}

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    user: state.user,
    chatnick: state.chatnick
  }
}

const mapDispatchToProps = {
  setRooms,
  newMessage,
  setUsers,
  logoutUser,
  removeChatnick,
  removePrivateRooms,
  setRoom,
  setFullRooms,
  removeUserInfo,
  setWindow,
  setUser,
  setUserInfo,
  setInvites,
  setChatnick,
  setFaces
}

const connectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default connectedApp
