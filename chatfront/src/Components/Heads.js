import React from 'react'
import { connect } from 'react-redux'
import Head from './Head'

const Heads = (props) => {
    
    const users = props.users.filter(u => u.room === props.room)
    // PROPS.CHATNICK SOTKEE! ELI LOGIIKKA CHATROOMISISSA PITÄÄ TSEKATA!

    return (
        <div>
            <table>
                <tbody>
                <tr>
                {users.map(
                    user => user.chatnick === props.speaking ? 
                    <td key={user.chatnick}><Head letter={props.letter} user={user.chatnick}/></td> : 
                    <td key={user.chatnick}><Head letter='' user={user.chatnick}/></td>
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