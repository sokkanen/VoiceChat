
const userReducer = (state = 'Anonymous', action) => {
    switch (action.type) {
      case 'SETUSER':
        return action.data
      case 'LOGOUTUSER': // TESTAAMATTA
        return 'Anonymous'
      default: return state
    }
  }
  
  export default userReducer
  
  export const setUser = (user) => {
    return async dispatch => {
      dispatch ({
        type: 'SETUSER',
        data: user
        })
    }
  }
  
  export const logoutUser = () => {
    return async dispatch => {
      dispatch ({
        type: 'LOGOUTUSER'
        })
    }
  }