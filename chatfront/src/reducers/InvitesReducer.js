const invitesReducer = (state = [], action) => {
    switch (action.type) {
      case 'SETINVITES':
        return action.data
      case 'DECLINEINVITATION':
        return state.filter(i => i.room_id !== action.data.room_id)
      case 'ACCEPTINVITATION':
        return state.filter(i => i.room_id !== action.data.room_id)
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

    export const declineInvitation = (invitation) => {
    return async dispatch => {
      dispatch ({
        type: 'DECLINEINVITATION',
        data: invitation
        })
    }
  }

    export const acceptInvitation = (invitation) => {
    return async dispatch => {
      dispatch ({
        type: 'ACCEPTINVITATION',
        data: invitation
        })
      }
  }
