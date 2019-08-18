import React from 'react'

const ChatText = ({messages, msgcount, visible}) => {
    if (!visible){
        return <div></div>
    }

    const heightCounter = () => {
        return msgcount * 30;
    }

    const style = {
        margin: '20px',
        border: '5px solid black',
        height: `${heightCounter()}px`,
        backgroundColor: 'gray',
        color: 'white',
    }

    const messageStyle = {
        color: 'aquamarine',
        display: 'inline' 
    }

    const userStyle = {
        color: 'powderblue',
        display: 'inline' 
    }

    return (
        <div style={style}>
            <ul>
                {messages.map(msg => 
                <li key={msg.msg}>
                    <p style={userStyle}>{msg.user}: <p style={messageStyle}>{msg.msg}</p></p>
                </li>)}
            </ul>
        </div>
    )
}

export default ChatText