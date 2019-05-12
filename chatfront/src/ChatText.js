import React from 'react'

const ChatText = ({messages, msgcount, visible}) => {
    if (!visible){
        return <div></div>
    }

    const heightCounter = () => {
        return msgcount * 25;
    }

    const style = {
        margin: '20px',
        border: '5px solid black',
        height: `${heightCounter()}px`,
        'background-color': 'gray',
        color: 'white'
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