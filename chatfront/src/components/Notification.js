import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = (props) => {

    const [show, setShow] = useState(true)

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