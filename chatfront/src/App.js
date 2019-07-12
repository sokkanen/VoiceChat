import React, { useEffect } from 'react';
import openSocket from 'socket.io-client'
import {BrowserRouter as Router,Route, Link, Redirect, withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import { setRooms } from './Reducers/RoomsReducer'
import { newMessage } from './Reducers/MessageReducer'
import { setUsers } from './Reducers/UsersReducer'

import Chatrooms from './Components/Chatrooms'
import Room from './Components/Room'
import NewUserForm from './Components/NewUserForm'
import LoginForm from './Components/LoginForm'

const socket = openSocket('http://localhost:3003/')

const App = (props) =>  {

  useEffect(() => {
    socket.emit('requestRooms')
    socket.on('message', (msg) => {
      props.newMessage(msg)
    })
    socket.on('users', (changedUsers) => {
      props.setUsers(changedUsers)
    })
  }, [])
  

  const Home = () => {
    return (
      <div>
        <div>
          <h1>Welcome to voicechat!</h1>
        </div>
        <em>Copyright Joel Sokkanen 2019</em>
      </div>
    )
  }

  const roomByTitle = (title) => props.rooms.find(r => r.title === title)

  const style = { padding: 10 }

  return (
      <div>
        <div>
          <Router>
            <div>
              <Link style={style} to="/">Home</Link>
              <Link style={style} to="/rooms">Chatrooms</Link>
              <Link style={style} to="/register">New User</Link>
              <Link style={style} to="/login">Login</Link>
              {props.user ? 'Logged in: ' + props.user : null}
            </div>
            <Route exact path="/" render={() => <Home/>}/>
            <Route path="/register" render={() => <NewUserForm socket={socket}/>}/>
            <Route path="/login" render={() => <LoginForm socket={socket}/>}/>
            <Route exact path="/rooms" render={() => <Chatrooms socket={socket} Link={Link} />}/>
            <Route exact path="/rooms/:title" render={({ match }) =>
              <Room room={roomByTitle(match.params.title)} socket={socket} />
            } />
          </Router>
        </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    user: state.user
  }
}

const mapDispatchToProps = {
  setRooms,
  newMessage,
  setUsers,
}

const connectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default connectedApp
