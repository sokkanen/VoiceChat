import React, { useEffect } from 'react';
import openSocket from 'socket.io-client'
import {BrowserRouter as Router,Route, Link, Redirect, withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import { setRooms } from './Reducers/RoomReducer'
import { newMessage } from './Reducers/MessageReducer'

import Chatrooms from './Components/Chatrooms'
import UserRegister from './Components/UserRegister'
import Room from './Components/Room'

const socket = openSocket('http://localhost:3003/')

const App = (props) =>  {
  
  useEffect(() => {
    socket.emit('requestRooms')
    socket.on('rooms', (rooms) => {
      props.setRooms(rooms)
    })
    socket.on('message', (msg) => {
      props.newMessage(msg)
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
            </div>
            <Route exact path="/" render={() => <Home/>}/>
            <Route path="/register" render={() => <UserRegister/>}/>
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
    rooms: state.rooms
  }
}

const mapDispatchToProps = {
  setRooms,
  newMessage
}

const connectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default connectedApp
