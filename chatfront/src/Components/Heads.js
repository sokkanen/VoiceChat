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
        <div style={{width: props.windowSize.width * 0.3, margin: '15px'}}>
            <CardColumns>
            {props.users
            .map(user => user.chatnick === props.speaking ? 
            <Head 
                key={user.chatnick}
                letter={props.letter} 
                chatnick={user.chatnick} 
                registered={user.registered}
                images={user.images}
                typing={user.typing}
                room={props.room}
            />: 
            <Head 
                key={user.chatnick}
                letter='' 
                chatnick={user.chatnick} 
                registered={user.registered}
                images={user.images}
                typing={user.typing}
                room={props.room}
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
      speaking: state.speaking,
      windowSize: state.windowSize
    }
  }
  
  const connectedHeads = connect(mapStateToProps)(Heads)

  export default connectedHeads