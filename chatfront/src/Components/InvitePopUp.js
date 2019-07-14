import React from 'react'
import Popup from 'reactjs-popup'

const InvitePopUp = (props) => {

    const users = props.users ? props.users : []

    console.log(users)

    return (
        <div>
            <Popup trigger={<button> Manage users </button>} modal>
                {close => (
                <div>
                    <div><h3>Users</h3></div>
                        <ul>
                            {users.map(u => u.chatnick)}
                        </ul>
                    <div><h3>Invite</h3></div>
                    <div>
                    <button onClick={() => {close()}}>OK</button>
                    </div>
                </div>
                )}
            </Popup>
        </div>
    )
}

export default InvitePopUp