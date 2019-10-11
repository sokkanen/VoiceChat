const invitesReducer = (state = [], action) => {
    switch (action.type) {
      case 'SETINVITES':
        return action.data
      default: return state
    }
  }
  
  export default invitesReducer
  
  export const setInvites = (invites) => {
    return async dispatch => {
      dispatch ({
        type: 'SETINVITES',
        data: invites
        })
    }
  }