const initial = {
  height: window.innerHeight,
  width: window.innerWidth
}

const windowSizeReducer = (state = initial, action) => {
    switch (action.type) {
      case 'SETWINDOW':
        return action.data
      default: return state
    }
  }
  
  export default windowSizeReducer
  
  export const setWindow = (size) => {
    return async dispatch => {
      dispatch ({
        type: 'SETWINDOW',
        data: size
        })
    }
  }