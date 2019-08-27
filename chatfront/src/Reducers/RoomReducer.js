
const roomReducer = (state = [], action) => {
  switch (action.type) {
    case 'SETROOM':
      return action.data
    default: return state
  }
}

export default roomReducer

export const setRoom = (room) => {
  return async dispatch => {
    dispatch ({
      type: 'SETROOM',
      data: room
      })
  }
}