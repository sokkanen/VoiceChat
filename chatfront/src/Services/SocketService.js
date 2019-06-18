/*

VAHVASTI VAIHEESSA!

import { useEffect } from 'react'
import { connect } from 'react-redux'
import openSocket from 'socket.io-client'
import { setRooms } from '../Reducers/RoomReducer'

const socket = openSocket('http://localhost:3003/')

const sockets = (props) => {
    socket.emit('requestRooms')
    socket.on('rooms', (rooms) => {
        props.setRooms(rooms)
    })
}

const mapStateToProps = (state) => {
    return {
      rooms: state.rooms
    }
  }
  
  const mapDispatchToProps = {
    setRooms,
  }
  
  const connectedSockets = connect(
    mapStateToProps,
    mapDispatchToProps
  )(sockets)
  
  export default { connectedSockets }*/