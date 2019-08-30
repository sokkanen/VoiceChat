import React, { useState } from 'react'

const ChatText = ({messages, largeChat, visible}) => {

    const chatBoxSize = largeChat ? 0.5 : 0.25

    const style = {
        margin: '20px',
        border: '5px solid black',
        height: `${window.innerHeight * chatBoxSize}px`,
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