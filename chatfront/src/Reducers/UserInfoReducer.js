
const userInfoReducer = (state = null, action) => {
    switch (action.type) {
      case 'SETUSERINFO':
        return action.data
      case 'REMOVEUSERINFO':
        return null
      default: return state
    }
  }
  
  export default userInfoReducer
  
  export const setUserInfo = (user) => {
    return async dispatch => {
      dispatch ({
        type: 'SETUSERINFO',
        data: user
        })
    }
  }
  
  export const removeUserInfo = () => {
    return async dispatch => {
      dispatch ({
        type: 'REMOVEUSERINFO'
        })
    }
  }