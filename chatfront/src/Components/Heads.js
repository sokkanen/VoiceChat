import React from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import Head from './Head'

const Heads = (props) => {

    const helperArray = []
    for(let i=0;i<Math.ceil(props.users.length / 5);i++){
        helperArray.push(i+1)
    }

    return (
        <div>
            <Container>
                {helperArray.map(rowNumber => 
                    <Row>
                        {props.users
                        .slice((rowNumber-1) * 5, ((rowNumber-1) * 5) + 5)
                        .map(user => user.chatnick === props.speaking ? 
                        <Col xs={6} md={4}>
                        <td key={user.chatnick}><Head 
                            letter={props.letter} 
                            chatnick={user.chatnick} 
                            registered={user.registered}
                            images={user.images}
                        /></td>
                        </Col> : 
                        <Col xs={6} md={4}>
                        <td key={user.chatnick}><Head 
                            letter='' 
                            chatnick={user.chatnick} 
                            registered={user.registered}
                            images={user.images}
                        /></td>
                        </Col>
                        )}
                    </Row>
                )}
            </Container>
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