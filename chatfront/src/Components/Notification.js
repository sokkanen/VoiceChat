import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = (props) => {

    const textColor = props.textColor
    const [show, setShow] = useState(true)

    const style = {
        margin: '20px',
        border: `5px solid ${textColor}`,
        height: `50px`,
        backgroundColor: 'gray',
        color: textColor,
        fontSize: '30px'
    }

    if (props.notification.length === 0 || !show){
        return (
            <div></div>
        )
    }
    return (
    <div>
      <Alert variant="success" onClose={() => setShow(!show)} dismissible>
        <h3>{props.notification}</h3>
      </Alert>
    </div>)
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