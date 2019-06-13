import React from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {

    const textColor = props.textColor

    const style = {
        margin: '20px',
        border: `5px solid ${textColor}`,
        height: `50px`,
        backgroundColor: 'gray',
        color: textColor,
        fontSize: '30px'
    }

    if (props.notification.length === 0){
        return (
            <div></div>
        )
    }
    return <div style={style}>{props.notification}</div>

}

const mapStateToProps = (state) => {
    return {
      notification: state.notification
    }
  }
  
  const connectedNotification = connect(
    mapStateToProps
  )(Notification)

export default connectedNotification