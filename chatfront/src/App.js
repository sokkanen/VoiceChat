import React, { useEffect } from 'react';
import io from 'socket.io-client';
import {BrowserRouter as Router,Route, Link, Redirect, withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import { Navbar, Nav } from 'react-bootstrap'
import { setRooms, setFullRooms } from './Reducers/RoomsReducer'
import { newMessage } from './Reducers/MessageReducer'
import { setUsers } from './Reducers/UsersReducer'
import { logoutUser } from './Reducers/UserReducer'
import { removeChatnick } from './Reducers/ChatnickReducer'
import { removePrivateRooms } from './Reducers/PrivateRoomsReducer'
import { removeFaces } from './Reducers/OwnFaceReducer'
import { setRoom } from './Reducers/RoomReducer'
import { removeUserInfo } from './Reducers/UserInfoReducer'
import Invites from './Components/Invites'
import backGroundImage from './Images/home.png'

import Chatrooms from './Components/Chatrooms'
import Room from './Components/Room'
import NewUserForm from './Components/NewUserForm'
import LoginForm from './Components/LoginForm'
import Home from './Components/Home'
import Ownface from './Components/Ownface'
import UserManagement from './Components/UserManagement'

const LOCAL = 'http://localhost:3003'
const HOST = window.location.origin.replace(/^http/, 'ws')
let socket
window.location.origin === 'http://localhost:3000' ? socket = io(LOCAL) : socket = io(HOST)

const App = (props) =>  {
  useEffect(() => {
    socket.emit('requestRooms')
    socket.on('message', (msg) => {
      props.newMessage(msg)
    })
    socket.on('imagesSaved', (value) => {
      value === true ? 
      window.alert('Your photos are successfully saved!') :
      window.alert('Error in saving your photos. Please try again.')
    })
    socket.on('room', (room, roomUsers) => {
      props.setRoom(room)
      window.localStorage.setItem('room', room)
      props.setUsers(roomUsers)
    })
    socket.on('full', (fullRooms) => {
      props.setFullRooms(fullRooms)
    })
  }, [])
  
  const roomByTitle = (title) => props.rooms.find(r => r.title === title)

  const style = { 
    padding: 10,
    background: "#6b7574",
    color: "white",
    'font-weight': "bold"
  }

  const logOutHandler = () => {
    props.logoutUser()
    props.removeChatnick()
    props.removePrivateRooms()
    props.removeFaces()
    props.setUsers([])
    props.setRoom('')
    props.removeUserInfo()
    socket.emit('logout')
    window.localStorage.removeItem('user')
  }

  if (props.user){
    return (
      <div class="container">
        <Router>
        <Navbar bg="light" variant="light">
          <div>
          <Link style={style} to="/">
            <img alt="" src={backGroundImage} width="30" height="30" className="d-inline-block align-top"/>
          </Link>
          <Link style={style} to="/rooms">Chatrooms</Link>
          <Link style={style} to="/alterface">Create chatface</Link>
        </div>
        </Navbar>
            <div>
            Logged in: <Link style={style} to="/usrmngmt">{props.user}</Link>
              <button onClick={logOutHandler}>LogOut</button> 
              <Invites socket={socket}/>
            </div>
            <Route exact path="/" render={() => <Home/>}/>
            <Route path="/alterface" render={() => <Ownface socket={socket}/>}/>
            <Route path="/login" render={() => props.user === '' ? 
              <LoginForm socket={socket}/> : <Redirect to="/rooms"/>
              }/>
            <Route exact path="/rooms" render={() => <Chatrooms socket={socket} Link={Link} />}/>
            <Route exact path="/rooms/:title" render={({ match }) => 
              props.chatnick === '' ? <Redirect to="/rooms"/> :
              <Room room={roomByTitle(match.params.title)} socket={socket} />
            }/>
            <Route path="/usrmngmt" render={() => <UserManagement socket={socket}/>}/>
        </Router>
      </div>
    )
  }


  return (
      <div class="container">
        <Router>
        <nav class="navbar fixed-top navbar-expand-md" style={style}>
        <div class="container-fluid">
        <div>
          <Link style={style} to="/">
            <img alt="" src={backGroundImage} width="30" height="30" className="d-inline-block align-top"/>
          </Link>
          <Link style={style} to="/rooms">Chatrooms</Link>
          <Link style={style} to="/register">New User</Link>
          <Link style={style} to="/login">Login</Link>
        </div>
        </div>
        </nav>
        <div class="container">
          <Route exact path="/" render={() => <Home/>}/>
          <Route path="/register" render={() => <NewUserForm socket={socket}/>}/>
          <Route path="/alterface" render={() => <Home/>}/>
          <Route path="/login" render={() => props.user === '' ? 
          <LoginForm socket={socket}/> : <Redirect to="/rooms"/>
          }/>
          <Route exact path="/rooms" render={() => <Chatrooms socket={socket} Link={Link} />}/>
          <Route exact path="/rooms/:title" render={({ match }) => 
            props.chatnick === '' ? <Redirect to="/rooms"/> :
            <Room room={roomByTitle(match.params.title)} socket={socket} />
          }/>
          <Route path="/usrmngmt" render={() => <Home/>}/>
        </div>
        </Router>
        <footer className="blockquote-footer">
        <nav class="navbar fixed-bottom navbar-expand-md" style={style}> 
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
  removeFaces,
  setRoom,
  setFullRooms,
  removeUserInfo
}

const connectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default connectedApp
