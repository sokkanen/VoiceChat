import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import Popup from 'reactjs-popup'
import settingsImage from '../Images/settings.png'

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
                    ? <div style={{border:'5px solid #cecece', padding: '20px', backgroundColor: '#c3e3da'}}>
                    <Form onSubmit={invite}>
                    <Form.Group controlId="invited">
                        <Form.Label>Email or Username to be invited</Form.Label>
                        <Form.Control name="invited" placeholder="Email or Username"/>
                    </Form.Group>
                    <Button variant="outline-success" type="submit">
                        Invite
                    </Button>
                    </Form>
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
            <Popup trigger={<Button variant="outline-primary"><img src={settingsImage} width="30" height="30" alt="remove room"></img></Button> } modal>
                {close => (
                <div style={{border:'5px solid #cecece', padding: '20px', backgroundColor: '#dfe7eb'}}>
                    <h4 style={{border:'2px solid #8bc9e8', padding: '20px'}}>Room's users</h4>
                        <ul>
                            {privateRoomUsers.map(user => 
                            user.id === privateRoom.owner_id ?
                            <li key={user.id}><b>{user.username} ({user.email})</b></li>
                            : <li key={user.id}>{user.username} ({user.email})</li>)}
                        </ul>
                    <div><Button style={{marginBottom: '5px'}} variant="outline-primary" onClick={() => setInviteFormVisible(!inviteFormVisible)}><b>Invite users</b></Button></div>
                      <InviteForm/>
                    <div>
                    <Button style={{marginTop: '5px'}} variant="outline-primary" onClick={() => {close()}}>OK</Button>
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