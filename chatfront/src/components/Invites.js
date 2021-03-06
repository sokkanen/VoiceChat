import React from 'react';
import { connect } from 'react-redux'
import Popup from 'reactjs-popup'
import { Button } from 'react-bootstrap'
import { setPrivateRooms } from '../reducers/PrivateRoomsReducer'
import { acceptInvitation, declineInvitation } from '../reducers/InvitesReducer'


const Invites = (props) => {

    const invites = props.invites
    const socket = props.socket

    const acceptInvitation = (invitation) => () => {
        socket.emit('acceptInvitation', invitation)
        props.acceptInvitation(invitation)
        removeInvitationFromLocalStorage(invitation)
    }

    const declineInvitation = (invitation) => () => {
        socket.emit('declineInvitation', invitation)
        props.declineInvitation(invitation)
        removeInvitationFromLocalStorage(invitation)
    }

    const removeInvitationFromLocalStorage = (invitation) => {
        const userData = JSON.parse(window.localStorage.getItem('user'))
        const localInvitations = userData.invites.filter(i => i.room_id !== invitation.room_id)
        const newUser = {...userData, invites: localInvitations}
        window.localStorage.setItem('user', JSON.stringify(newUser))
    }

    const style = { 
        padding: 10,
        background: "#c6cfcf",
        color: "white",
        fontWeight: "bold"
    }

    return (
            <Popup trigger={invites.length === 0 ? 
            <Button variant="outline-info" disabled>No new invitations</Button> : 
            <Button variant="outline-success" >Click to see new invitations!</Button>}modal>
                {close => (
                <div style= {style}>
                    <h3><u>Invitations</u></h3>
                        <ul>
                            {invites.map(i => <li key={i.room_id + i.invitee_id}>
                            <p>You've been invited by {i.inviter} to join '{i.room}'</p>
                            <Button variant="outline-success" onClick={acceptInvitation(i)}>Accept</Button>
                            <Button style={{marginLeft: '5px'}}variant="outline-danger" onClick={declineInvitation(i)}>Decline</Button>
                            </li>)}
                        </ul>
                    <div>
                    <Button variant="outline-primary" onClick={() => {close()}}>OK</Button>
                    </div>
                </div>
                )}
            </Popup>
    )
}

const mapStateToProps = (state) => {
    return {
      privateRooms: state.privateRooms,
      user: state.user,
      invites: state.invites
    }
  }

  const mapDispatchToProps = {
    setPrivateRooms,
    acceptInvitation,
    declineInvitation
  }
  
  const connectedInvites = connect(mapStateToProps, mapDispatchToProps)(Invites)
  
  export default connectedInvites