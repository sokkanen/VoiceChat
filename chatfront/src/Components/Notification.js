import React from 'react'

const Notification = ({notification, textColor}) => {

    const style = {
        margin: '20px',
        border: `5px solid ${textColor}`,
        height: `50px`,
        backgroundColor: 'gray',
        color: textColor,
        fontSize: '30px'
    }

    if (notification.length === 0){
        return (
            <div></div>
        )
    }
    return <div style={style}>{notification}</div>

}

export default Notification