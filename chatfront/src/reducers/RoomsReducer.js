
const roomsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SETROOMS':
      return action.data.sort((a, b) => a.name.localeCompare(b.name))
    case 'SETFULLROOMS':
      const fullRooms = action.data
      return state.map(r => fullRooms.includes(r.name) ? ({...r, full: true}) : ({...r, full: false}))
    case 'REMOVEROOM':
          return state.filter(room => room.id !== action.data.id)
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

export const setFullRooms = (fullRooms) => {
  return async dispatch => {
    dispatch ({
      type: 'SETFULLROOMS',
      data: fullRooms
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