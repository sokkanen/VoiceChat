// Chatnick is used for unregistered users. 

const chatnickReducer = (state = '', action) => {
    switch (action.type) {
      case 'SETCHATNICK':
        return action.data
      case 'REMOVECHATNICK':
        return ''
      default: return state
    }
  }
  
  export default chatnickReducer
  
  export const setChatnick = (nickname) => {
    return async dispatch => {
      dispatch ({
        type: 'SETCHATNICK',
        data: nickname
        })
    }
  }
  
  export const removeChatnick = () => {
    return async dispatch => {
      dispatch ({
        type: 'REMOVECHATNICK'
        })
    }
  }