
const userReducer = (state = '', action) => {
    switch (action.type) {
      case 'SETUSER':
        return action.data
      case 'LOGOUTUSER':
        window.localStorage.setItem('user', null)
        return ''
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