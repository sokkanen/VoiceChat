
const usersReducer = (state = [], action) => {
    switch (action.type) {
      case 'SETUSERS':
        if (action.data.length === 0){
          const zeroUsers = []
          const userZero = {
            name: 'Anonymous'
          }
          zeroUsers.push(userZero)
          return zeroUsers
        }
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