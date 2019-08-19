
const roomsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SETROOMS':
      return action.data
    case 'SETFULLROOMS':
      const fullRooms = action.data
      return state.map(r => fullRooms.includes(r.name) ? ({...r, full: true}) : ({...r, full: false}))
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