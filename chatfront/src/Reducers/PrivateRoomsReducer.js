
const privateRoomsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SETPRIVATEROOMS':
      return action.data.sort((a, b) => a.name.localeCompare(b.name))
    case 'REMOVEPRIVATEROOMS':
      return []
    case 'SETFULLPRIVATEROOMS':
        const fullRooms = action.data
        return state.map(r => fullRooms.includes(r.name) ? ({...r, full: true}) : ({...r, full: false}))
    case 'REMOVEPRIVATEROOM':
        return state.filter(room => room.id !== action.data.id)
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

export const setFullPrivateRooms = (fullRooms) => {
  return async dispatch => {
    dispatch ({
      type: 'SETFULLPRIVATEROOMS',
      data: fullRooms
      })
  }
}

export const removePrivateRoom = (room) => {
  return async dispatch => {
    dispatch ({
      type: 'REMOVEPRIVATEROOM',
      data: room
      })
  }
}