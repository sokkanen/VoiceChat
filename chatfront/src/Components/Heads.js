import React from 'react'
import { connect } from 'react-redux'
import Head from './Head'

const Heads = (props) => {

    const users = props.users.filter(u => u.room === props.room.title)

    return (
        <div>
            <table>
                <tbody>
                <tr>
                {users.map(
                    user => user.name === props.speaking ? 
                    <td key={user.name}><Head letter={props.letter} user={user.name}/></td> : 
                    <td key={user.name}><Head letter='' user={user.name}/></td>
                )}
                </tr>              
                </tbody>
            </table>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      users: state.users,
      letter: state.letter,
      speaking: state.speaking
    }
  }
  
  const connectedHeads = connect(mapStateToProps)(Heads)

  export default connectedHeads