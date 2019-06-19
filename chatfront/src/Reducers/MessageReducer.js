
const messageReducer = (state = '', action) => {
    switch (action.type) {
      case 'NEWMESSAGE':
        return action.data
      default: return state
    }
  }
  
  export default messageReducer
  
  export const newMessage = (message) => {
    return async dispatch => {
      dispatch ({
        type: 'NEWMESSAGE',
        data: message
        })
    }
  }