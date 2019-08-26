
const usersReducer = (state = [], action) => {
    switch (action.type) {
      case 'SETUSERS':
        return action.data
      case 'ADDUSERTOUSERS':
        return state.concat(action.data)
      case 'REMOVEUSERFROMUSERS':
        const removedUsers = state.filter(u => u.id !== action.data)
        return removedUsers
      case 'SETTYPING':
        return state.map(user => user.chatnick === action.data ? {...user, typing: action.typing} : user)
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

  export const addUserToUsers = (user) => {
    return async dispatch => {
      dispatch ({
        type: 'ADDUSERTOUSERS',
        data: [user]
        })
    }
  }

  export const removeUserFromUsers = (id) => {
    return async dispatch => {
      dispatch ({
        type: 'REMOVEUSERFROMUSERS',
        data: id
        })
    }
  }

  export const setTyping = (chatnick, typing) => {
    return async dispatch => {
      dispatch ({
        type: 'SETTYPING',
        data: chatnick,
        typing: typing
        })
    }
  }