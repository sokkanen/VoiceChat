import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './Forms.css'

const ChatText = ({ messages, largeChat, visible, users }) => {

    const [chatWidth, setChatWidth] = useState(window.innerWidth / 3)
    const [chatHeight, setChatHeight] = useState(window.innerHeight * 0.8)

    const handleResize = () => {
      setChatWidth(window.innerWidth / 3)
      setChatHeight(window.innerHeight * 0.8)
    }
  
    window.addEventListener('resize', handleResize)
    
    const chatBoxSize = largeChat ? 0.5 : 0.25
    
    const style = {
        margin: '15px',
        border: '5px solid black',
        height: `${chatHeight * chatBoxSize}px`,
        width: `${chatWidth}px`,
        backgroundColor: 'gray',
        color: 'white',
        padding: '2px',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse'
    }

    const messageStyle = {
        color: 'aquamarine',
        display: 'inline',
    }

    const userStyle = {
        display: 'inline'
    }

    const returnUserColor = (chatnick) => {
        const user = users.find(user => user.chatnick === chatnick)
        if (user === undefined){
            return 'powderblue'
        } else if (user.color === undefined){
            return 'powderblue'
        }
        return user.color
    }

    if (!visible){
        return <div></div>
    }

    return (
        <div className="content" style={style}>
                {messages.map(msg => 
                <div>
                    <Container>
                        <Row>
                            <Col md="auto">
                                <div class="userballoon" style={{border: `4px solid ${returnUserColor(msg.user)}`}}>
                                    <p style={userStyle}>{msg.user}:</p>
                                </div>
                            </Col>
                            <Col md="auto">
                                <div class="bubble triangle">
                                    <p style={messageStyle}>{msg.msg}</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                )}
            
        </div>
    )
}
  
export default ChatText