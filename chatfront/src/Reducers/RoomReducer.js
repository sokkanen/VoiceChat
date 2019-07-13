
const roomReducer = (state = [], action) => {
  switch (action.type) {
    case 'SETROOM':
      return action.data
    case 'REMOVEROOM':
      const newRooms = state.rooms.filter(r => r.title !== action.data.room)
      return {...state, rooms: newRooms}
    default: return state
  }
}

export default roomReducer

export const setRoom = (rooms) => {
  return async dispatch => {
    dispatch ({
      type: 'SETROOM',
      data: rooms
      })
  }
}

export const removeRoom = (room) => {
  return async dispatch => {
    dispatch ({
      type: 'REMOVEROOM',
      data: room
      })
  }
}