
const roomsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SETROOMS':
      return action.data
    default: return state
  }
}

export default roomsReducer

export const setRooms = (rooms) => {
  return async dispatch => {
    dispatch ({
      type: 'SETROOMS',
      data: rooms
      })
  }
}