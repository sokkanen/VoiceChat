import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Pagination from 'react-js-pagination'
import { Table, Button, Form, InputGroup } from 'react-bootstrap'
import { setNotification } from '../reducers/NotificationReducer'
import { setRoom } from '../reducers/RoomReducer'
import { setRooms, setFullRooms, removeRoom } from '../reducers/RoomsReducer'
import { setPrivateRooms, setFullPrivateRooms, removePrivateRoom } from '../reducers/PrivateRoomsReducer'
import { setChatnick} from '../reducers/ChatnickReducer'
import { setInviteStatus } from '../reducers/InviteStatusReducer'
import { setUsers } from '../reducers/UsersReducer'
import InvitePopUp from './InvitePopUp'
import './Forms.css'
import NewRoomForm from './NewRoomForm'
import Notification from './Notification'
import removeImage from '../images/remove.png'

const Chatrooms = (props) => {
    const [visible, setVisible] = useState(false)
    const [newRoomText, setNewRoomText] = useState('Create a New Room')
    const [textColor, setTextColor] = useState('#62f442')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [privatePage, setPrivatePage] = useState(1)

    const socket = props.socket
    const Link = props.Link

    useEffect(() => {
      if (props.user){
        socket.emit('requestRooms', JSON.parse(window.localStorage.getItem('user')).id)
      } else {
        socket.emit('requestRooms', null)
      }
      socket.on('error', (msg) => {
        if (msg.id === socket.id){
          setTextColor('#ed1f10')
          notificate(msg.message)
        }
      })
      socket.on('rooms', (rooms, privateRooms, fullRooms) => {
        setPage(1)
        setPrivatePage(1)
        props.setRooms(rooms)
        props.setPrivateRooms(privateRooms)
        props.setFullRooms(fullRooms)
        props.setFullPrivateRooms(fullRooms)
      })
      socket.on('checkChatnick', (available, id, chatnick) => {
          if (id === socket.id){
              if (available){
                props.setChatnick(chatnick)
              } else {
                alert(`${chatnick} not available. Please try another.`)
              }
          }
      }) 
    socket.on('invitation', (values) => {
    if (values.id === socket.id){
        if (values.success === true){
            props.setInviteStatus("User invited")
            setTimeout(() => {
                props.setInviteStatus("")
            }, 2500);
        } else {
            props.setInviteStatus("User not found or user already invited to the room.")
            setTimeout(() => {
                props.setInviteStatus("")
            }, 2500);
        }
    }
    })
    socket.on('updatedPrivateRooms', (updatedRooms) => {
        props.setPrivateRooms(updatedRooms)
    })
      return() => {
        socket.off('error')
        socket.off('rooms')
        socket.off('checkChatnick')
        socket.off('invitation')
        socket.off('updatedPrivateRooms')
      }

    },[])

    const newRoomVisible = () => {
        setVisible(!visible)
        if (newRoomText === 'Create a New Room'){
            setNewRoomText('Close room creation')
        } else {
            setNewRoomText('Create a New Room')
        }
    }

    const notificate = (message) => {
        props.setNotification(message)
        setTimeout(() => {
          props.setNotification('')
          setTextColor('#62f442')
        }, 5000)
    }

    const joinRoomHandler = (event) => {
        event.preventDefault()
        props.setUsers([])
        const registered = props.user !== "" ? true : false
        const joinRoomInfo = {
            id: socket.id,
            chatnick: props.chatnick,
            room: event.target.name,
            oldroom: window.localStorage.getItem('title'),
            registered: registered
        }
        socket.emit('roomJoin', joinRoomInfo)
    }

    const setChatNickname = (event) => {
        event.preventDefault()
        if (!event.target.chatnick){
            alert('Nickname must be between 3 and 15 characters.')
        } else {
            if (event.target.chatnick.value.length < 16 && event.target.chatnick.value.length > 2){
                socket.emit('checkChatnick', event.target.chatnick.value)
            } else {
                alert('Nickname must be between 3 and 15 characters.')
            }
            event.target.chatnick.value = ''
        }
    }

    const removeRoom = (room) => () => {
        if (window.confirm(`Do you really want to remove ${room.name}`)){
            const token = JSON.parse(window.localStorage.getItem('user')).token
            socket.emit('removeRoom', room, token)
            if (room.private){
                props.removePrivateRoom(room)
                setPage(1)
                setPrivatePage(1)
            } else {
                props.removeRoom(room)
                setPage(1)
                setPrivatePage(1)
            }
        }
    }

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber)
    }

    const handlePrivatePageChange = (pageNumber) => {
        setPrivatePage(pageNumber)
    }

    const style = { 
        padding: 10,
        margin: 45
    }

    if (props.rooms === undefined){
        return <div></div>
    }

    if (props.chatnick !== ''){
        return (
        <div style={style}>
            <div>
                <Notification textColor={textColor}/>
            </div>
            <div>
                <NewRoomForm socket={socket} visible={visible}/>
                <Button variant="outline-info" onClick={newRoomVisible}>{newRoomText}</Button>
            </div>
            <div className="text-center">
                <h2>Rooms</h2>
            </div>
            <div>
                <Form>
                    <Form.Group>
                        <Form.Label>Search for a room</Form.Label>
                        <Form.Control value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search..." />
                    </Form.Group>
                </Form>
            </div>
            <h2>Public rooms</h2>
            <div>
            <Table striped bordered hover size='sm'>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Max users</th>
                    <th>Info</th>
                    <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {props.rooms
                        .filter(r => r.name.toLowerCase().includes(search))
                        .slice((page-1) * 5, ((page-1) * 5) + 5)
                        .map(r =>
                        <tr key={r.id}>
                            {r.full ? <td>{r.name}</td> : <td onClick={joinRoomHandler}><Link name={r.name} to={`/rooms/${r.name}`}>{r.name}</Link></td>}
                            <td>{r.user_limit}</td>
                            {r.full ? <td>Room is full</td> : <td>{r.description}</td>}
                            <td>{props.user ? r.owner_id === JSON.parse(window.localStorage.getItem('user')).id ? 
                            <Button variant="outline-danger"><img src={removeImage} width="30" height="30" onClick={removeRoom(r)} alt="remove room"></img></Button> 
                            : 
                            null
                            : null}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
                <div className="text-center">
                    <Pagination
                    activePage={page}
                    itemsCountPerPage={5}
                    totalItemsCount={props.rooms.length}
                    pageRangeDisplayed={7}
                    onChange={handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                    />
                </div>
            </div>
            {props.user ?
            <div>
                <h2>{props.chatnick}'s Private rooms</h2>
                    <Table striped bordered hover size='sm'>
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Max users</th>
                        <th>Info</th>
                        <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                    {props.privateRooms
                        .filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
                        .slice((privatePage-1) * 5, ((privatePage-1) * 5) + 5)
                        .map(r =>
                        <tr key={r.name}>
                            {r.full ? <td>{r.name}</td> : <td onClick={joinRoomHandler}><Link name={r.name} to={`/rooms/${r.name}`}>{r.name}</Link></td>}
                            <td>{r.user_limit}</td>
                            {r.full === true ? <td>Room is full</td> : <td>{r.description}</td>}
                            <td>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>{props.user ? r.owner_id === JSON.parse(window.localStorage.getItem('user')).id ? 
                                        <Button variant="outline-danger"><img src={removeImage} width="30" height="30" onClick={removeRoom(r)} alt="remove room"></img></Button>
                                        : null: null}
                                        </td>
                                        <td><InvitePopUp currentRoom={r} socket={socket}/></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>

                        </tr>
                    )}
                    </tbody>
                    </Table>
                <div className="text-center">
                    <Pagination
                    activePage={privatePage}
                    itemsCountPerPage={5}
                    totalItemsCount={props.privateRooms.length}
                    pageRangeDisplayed={5}
                    onChange={handlePrivatePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                    />
                </div>
            </div>
            : null }
            
        </div>
        )
    }

    return (
        <div style={style}>
            <div>
                <Notification textColor={textColor}/>
            </div>
            <div>
            <Form onSubmit={setChatNickname}>
                <InputGroup>
                    <Form.Control
                    type="text"
                    name="chatnick"
                    id="chatnick"
                    placeholder="Nickname (or Register / Login)"
                    className="chatnick"
                    />
                    <InputGroup.Append>
                    <Button type="submit" variant="outline-success">Set nickname</Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form>
            </div>
            <div className="text-center">
                <h2>Rooms</h2>
            </div>
            <div>
            <Form>
                <Form.Group>
                    <Form.Label>Search for a room</Form.Label>
                    <Form.Control value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search..." />
                </Form.Group>
            </Form>
            </div>
            <div>
            <Table striped bordered hover size='sm'>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Max users</th>
                    <th>Info</th>
                    </tr>
                </thead>
                <tbody>
                    {props.rooms
                    .filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
                    .slice((page-1) * 5, ((page-1) * 5) + 5)
                    .map(r => <tr key={r.name}>
                        <td><p>{r.name}</p></td>
                        <td><p>{r.user_limit}</p></td>
                        {r.full ? <td>Room is Full</td> : <td>{r.description}</td>}
                    </tr>)}
                </tbody>
            </Table>
            </div>
            <div className="text-center">
                <Pagination
                activePage={page}
                itemsCountPerPage={5}
                totalItemsCount={props.rooms.length}
                pageRangeDisplayed={7}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
                />
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      rooms: state.rooms,
      privateRooms: state.privateRooms,
      notification: state.notification,
      room: state.room,
      chatnick: state.chatnick,
      user: state.user,
      users: state.users
    }
  }

  const mapDispatchToProps = {
    setNotification,
    setRoom,
    setRooms,
    setPrivateRooms,
    setChatnick,
    setInviteStatus,
    setUsers,
    setFullRooms,
    setFullPrivateRooms,
    removeRoom,
    removePrivateRoom
  }
  
  const connectedChatRooms = connect(mapStateToProps, mapDispatchToProps)(Chatrooms)
  
  export default connectedChatRooms