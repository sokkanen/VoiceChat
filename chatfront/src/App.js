import React, { useState, useEffect, useReducer } from 'react';
import openSocket from 'socket.io-client'
import {BrowserRouter as Router,Route, Link, Redirect, withRouter} from 'react-router-dom'

import Chatrooms from './Components/Chatrooms'
import UserRegister from './Components/UserRegister'
import Room from './Components/Room'

const socket = openSocket('http://localhost:3003/')

const App = () =>  {

  const [rooms, setRooms] = useState([])

  useEffect(() => {
    socket.emit('requestRooms')
    socket.on('rooms', (rooms) => {
      setRooms(rooms)
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

  const roomByTitle = (title) => rooms.find(r => r.title === title)

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
            <Route exact path="/rooms" render={() => <Chatrooms socket={socket} Link={Link} rooms={rooms}/>}/>
            <Route exact path="/rooms/:title" render={({ match }) =>
              <Room room={roomByTitle(match.params.title)} socket={socket} />
            } />
          </Router>
        </div>
    </div>
  )
}

export default App
