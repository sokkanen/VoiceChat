
const privateRoomsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SETPRIVATEROOMS':
      return action.data
    case 'REMOVEPRIVATEROOMS':
      return []
    default: return state
  }
}

export default privateRoomsReducer

export const setPrivateRooms = (rooms) => {
  return async dispatch => {
    dispatch ({
      type: 'SETPRIVATEROOMS',
      data: rooms
      })
  }
}

export const removePrivateRooms = () => {
  return async dispatch => {
    dispatch ({
      type: 'REMOVEPRIVATEROOMS'
      })
  }
}