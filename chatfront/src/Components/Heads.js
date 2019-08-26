import React from 'react'
import { connect } from 'react-redux'
import { CardColumns } from 'react-bootstrap'
import Head from './Head'

const Heads = (props) => {

    const helperArray = []
    for(let i=0;i<Math.ceil(props.users.length / 5);i++){
        helperArray.push(i+1)
    }

    return (
        <div>
           <CardColumns>
            {props.users
            .map(user => user.chatnick === props.speaking ? 
            <Head 
                letter={props.letter} 
                chatnick={user.chatnick} 
                registered={user.registered}
                images={user.images}
                typing={user.typing}
            />: 
            <Head 
                letter='' 
                chatnick={user.chatnick} 
                registered={user.registered}
                images={user.images}
                typing={user.typing}
            />
            )}
            </CardColumns>  
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