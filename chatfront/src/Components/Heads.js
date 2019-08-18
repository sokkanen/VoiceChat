import React from 'react'
import { connect } from 'react-redux'
import Head from './Head'

const Heads = (props) => {

    return (
        <div>
            <table>
                <tbody>
                <tr>
                {props.users.map(
                    user => user.chatnick === props.speaking ? 
                    <td key={user.chatnick}><Head 
                        letter={props.letter} 
                        chatnick={user.chatnick} 
                        registered={user.registered}
                        images={user.images}
                    /></td> : 
                    <td key={user.chatnick}><Head 
                        letter='' 
                        chatnick={user.chatnick} 
                        registered={user.registered}
                        images={user.images}
                    /></td>
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