const inviteStatusReducer = (state = '', action) => {
    switch (action.type) {
      case 'SETINVITESTATUS':
        return action.data
      default: return state
    }
  }
  
  export default inviteStatusReducer
  
  export const setInviteStatus = (status) => {
    return async dispatch => {
      dispatch ({
        type: 'SETINVITESTATUS',
        data: status
        })
    }
  }