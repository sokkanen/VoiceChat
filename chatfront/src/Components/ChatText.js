import React, { useState } from 'react'

const ChatText = ({ messages, largeChat, visible }) => {

    const [chatWidth, setChatWidth] = useState(window.innerWidth / 2)
    const [chatHeight, setChatHeight] = useState(window.innerHeight * 0.8)

    const handleResize = () => {
      setChatWidth(window.innerWidth / 2)
      setChatHeight(window.innerHeight * 0.8)
    }
  
    window.addEventListener('resize', handleResize)
    
    const chatBoxSize = largeChat ? 0.5 : 0.25
    const style = {
        margin: '20px',
        border: '5px solid black',
        height: `${chatHeight * chatBoxSize}px`,
        width: `${chatWidth}px`,
        backgroundColor: 'gray',
        color: 'white',
        padding: '5px',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse'
    }

    const messageStyle = {
        color: 'aquamarine',
        display: 'inline' 
    }

    const userStyle = {
        color: 'powderblue',
        display: 'inline' 
    }

    if (!visible){
        return <div></div>
    }

    return (
        <div className="content" style={style}>
            <ul>
                {messages.map(msg => 
                <li key={msg.msg + Math.random()}>
                    <p style={userStyle}>{msg.user}:</p> <p style={messageStyle}>{msg.msg}</p>
                </li>)}
            </ul>
        </div>
    )
}
  
export default ChatText