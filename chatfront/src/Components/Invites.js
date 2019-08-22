import React from 'react';
import { connect } from 'react-redux'
import Popup from 'reactjs-popup'
import { setPrivateRooms } from '../Reducers/PrivateRoomsReducer'
import { setInvites } from '../Reducers/InvitesReducer'


const Invites = (props) => {

    const invites = props.invites
    const socket = props.socket

    const acceptInvitation = (invitation) => () => {
        socket.emit('acceptInvitation', invitation)
        props.setInvites(invites.filter(i => i.room_id !== invitation.room_id))
    }

    const declineInvitation = (invitation) => () => {
        socket.emit('declineInvitation', invitation)
        props.setInvites(invites.filter(i => i.room_id !== invitation.room_id))
    }

    const style = { 
        padding: 10,
        background: "#6b7574",
        color: "white",
        'font-weight': "bold"
    }

    return (
            <Popup trigger={invites.length === 0 ? <button>No new invitations</button> : <button>Click to see new invitations!</button>}modal>
                {close => (
                <div style= {style}>
                    <h3>Invitations</h3>
                        <ul>
                            {invites.map(i => <li key={i.room_id + i.invitee_id}>
                            <p>You've been invited by {i.inviter} to join '{i.room}'</p>
                            <button onClick={acceptInvitation(i)}>Accept</button>
                            <button onClick={declineInvitation(i)}>Decline</button>
                            </li>)}
                        </ul>
                    <div>
                    <button onClick={() => {close()}}>OK</button>
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
    setInvites
  }
  
  const connectedInvites = connect(mapStateToProps, mapDispatchToProps)(Invites)
  
  export default connectedInvites