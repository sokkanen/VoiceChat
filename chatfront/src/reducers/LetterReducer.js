const letterReducer = (state = '', action) => {
    switch (action.type) {
      case 'SETLETTER':
        return action.data
      default: return state
    }
  }
  
  export default letterReducer
  
  export const setLetter = (letter) => {
    return async dispatch => {
      dispatch ({
        type: 'SETLETTER',
        data: letter
        })
    }
  }