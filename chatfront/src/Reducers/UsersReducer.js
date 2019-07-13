
const usersReducer = (state = [], action) => {
    switch (action.type) {
      case 'SETUSERS':
        return action.data
      default: return state
    }
  }
  
  export default usersReducer
  
  export const setUsers = (users) => {
    return async dispatch => {
      dispatch ({
        type: 'SETUSERS',
        data: users
        })
    }
  }