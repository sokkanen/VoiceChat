
const roomReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET':
    return action.data
    default: return state
  }
}

export default roomReducer

export const setRooms = (rooms) => {
  return async dispatch => {
    dispatch ({
      type: 'SET',
      data: rooms
      })
  }
}