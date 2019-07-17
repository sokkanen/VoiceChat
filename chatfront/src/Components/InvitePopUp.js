import React, { useState } from 'react'
import { connect } from 'react-redux'
import Popup from 'reactjs-popup'

const InvitePopUp = (props) => {

    const [inviteFormVisible, setInviteFormVisible] = useState(false)

    const currentRoom = props.currentRoom
    const privateRoom = props.privateRooms.filter(r => r.name === currentRoom)[0]
    const privateRoomUsers = privateRoom.users

    const invite = (event) => {
        event.preventDefault()
        console.log(event.target.invited.value) // TÄMÄ ETEENPÄIN.
        alert('Invitation sent!')
        event.target.invited.value = ''
    }

    const InviteForm = () => {
        if (!inviteFormVisible){
            return <div></div>
        }
        return (
            <div>
                <form onSubmit={invite}>
                <div>
                    <label>Email or Username to be invited:</label>
                    <input name="invited"></input>
                </div>
                <div>
                    <button type="submit">Invite!</button>
                </div>
            </form>
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
      privateRooms: state.privateRooms
    }
  }
  
  const mapDispatchToProps = {
  }
  
  const connectedInvitePopUp = connect(
    mapStateToProps,
    mapDispatchToProps
  )(InvitePopUp)
  
  export default connectedInvitePopUp