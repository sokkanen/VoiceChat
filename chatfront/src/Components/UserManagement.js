import React from 'react'
import { connect } from 'react-redux'

const UserManagement = (props) => {

  const style = { 
    padding: 10,
    margin: 45
  }

    return (
      <div style={style}>
        <div>
          <h1>User management</h1>
        </div>
        <div>
          {props.user}
        </div>
        <div>
          {props.userInfo}
        </div>
        <div>
          invites...
        </div>
        <div>
          remove profile...
        </div>
        <div>
          change password...
        </div>
        <div>
          change email...
        </div>
      </div>

    )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = {
}

const connectedUserManagement = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserManagement)

export default connectedUserManagement