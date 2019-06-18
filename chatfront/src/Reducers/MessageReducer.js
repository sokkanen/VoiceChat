
const messageReducer = (state = [], action) => {
    switch (action.type) {
      case 'SETMESSAGES':
        return action.data
      case 'ADDMESSAGE':
          if (state.messages.lenght > action.data.count){
              // SHIFT
          } else {
              // PUSH
          }
          return action.data
      case 'REMOVE': // TESTAAMATTA
        const newRooms = state.rooms.filter(r => r.title !== action.data.room)
        return {...state, rooms: newRooms}
      default: return state
    }
  }
  
  export default messageReducer
  
  export const setMessages = (messages) => {
    return async dispatch => {
      dispatch ({
        type: 'SETMESSAGES',
        data: messages
        })
    }
  }

  export const addMessage = (message, count) => {
    return async dispatch => {
      dispatch ({
        type: 'ADDMESSAGE',
        data: {
            message: message,
            count: count
        }
        })
    }
  }