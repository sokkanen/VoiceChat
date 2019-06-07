import React from 'react'

const Room = ({ room }) => {
    return (
        <div>
        <h1>THIS IS A ROOM</h1>
        <h2>{room.title}</h2>
        </div>
    )
}

export default Room