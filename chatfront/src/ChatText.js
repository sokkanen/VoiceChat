import React from 'react'

const style = {
    margin: '20px',
    border: '5px solid black',
    height: '150px',
}

const ChatText = ({messages, msgcount, visible}) => {
    if (!visible){
        return <div></div>
    }
    return (
        <div style={style}>
            <ul>
                {messages.map(msg => <li key={msg}>{msg}</li>)}
            </ul>
        </div>
    )
}

export default ChatText