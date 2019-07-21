import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Popup from 'reactjs-popup'

const InvitePopUp = (props) => {

    const [inviteFormVisible, setInviteFormVisible] = useState(false)

    const socket = props.socket
    const currentRoom = props.currentRoom.name
    const privateRoom = props.privateRooms.filter(r => r.name === currentRoom)[0]
    const privateRoomUsers = privateRoom.users
    const [popUpMessage, setPopUpMessage] = useState("")

    const invite = (event) => {
        event.preventDefault()
        const noNick = privateRoomUsers.filter(u => u.username === event.target.invited.value || u.email === event.target.invited.value)
         if (event.target.invited.value === props.user){
            setPopUpMessage("You don't need to invite yourself. :)")
            setTimeout(() => {
                setPopUpMessage("")
            }, 2000);
        } else if (noNick.length === 1){
            setPopUpMessage("Invitee is already in the list of room's users.")
            setTimeout(() => {
                setPopUpMessage("")
            }, 2500);
        } else {
            let invitation = {
                emailOrUsername: event.target.invited.value,
                roomId: privateRoom.id,
                inviter: props.user
            }
            socket.emit('invitation', invitation)
            event.target.invited.value = ''
        }
    }

    const InviteForm = () => {
        if (!inviteFormVisible){
            return <div></div>
        }
        return (
            <div>
                {popUpMessage === "" && props.inviteStatus === ""
                    ? <div>
                        <form onSubmit={invite}>
                        <label>Email or Username to be invited:</label>
                        <input name="invited"></input>
                        <button type="submit">Invite!</button>
                        </form>
                    </div>
                    : <div>
                        <h3 style={{ color: 'green' }}>{popUpMessage}</h3>
                        <h3 style={{ color: 'green' }}>{props.inviteStatus}</h3>
                    </div>
                }
            </div>
        )
    }

    return (
        <div>
            <Popup trigger={<button> Manage users </button>} modal>
                {close => (
                <div>
                    <div><h3>Current users</h3></div>
                        <ul>
                            {privateRoomUsers.map(user => 
                            user.id === privateRoom.owner_id ?
                            <li key={user.id}><b>{user.username}</b></li>
                            : <li key={user.id}>{user.username}</li>)}
                        </ul>
                    <div><button onClick={() => setInviteFormVisible(!inviteFormVisible)}><b>Invite more</b></button></div>
                      <InviteForm/>
                    <div>
                    <button onClick={() => {close()}}>OK</button>
                    </div>
                </div>
                )}
            </Popup>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      privateRooms: state.privateRooms,
      user: state.user,
      inviteStatus: state.inviteStatus
    }
  }
  
  const mapDispatchToProps = {
  }
  
  const connectedInvitePopUp = connect(
    mapStateToProps,
    mapDispatchToProps
  )(InvitePopUp)
  
  export default connectedInvitePopUp