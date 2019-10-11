const uniqueByKeepLastUser = (array, key) => {
  return [
      ...new Map(
          array.map(x => [key(x), x])
      ).values()
  ]
}

const usersReducer = (state = [], action) => {
    switch (action.type) {
      case 'SETUSERS':
        // Remove possible duplicates by id.
        return uniqueByKeepLastUser(action.data, user => user.id)
      case 'ADDUSERTOUSERS':
        return state.concat(action.data)
      case 'REMOVEUSERFROMUSERS':
        const removedUsers = state.filter(u => u.id !== action.data)
        return removedUsers
      case 'SETCOLOR':
        return state.map(user => user.chatnick === action.data ? {...user, color: action.color.hex} : user)
      case 'SETTYPING':
        return state.map(user => user.chatnick === action.data ? {...user, typing: action.typing} : user)
      case 'SETMUTED':
        return state.map(user => user.chatnick === action.chatnick ? {...user, muted: action.muted} : user)
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

  export const setUserColor = (chatnick, color) => {
    return async dispatch => {
      dispatch ({
        type: 'SETCOLOR',
        data: chatnick,
        color: color
        })
    }
  }

  export const setMuted = (chatnick, muted) => {
    return async dispatch => {
      dispatch ({
        type: 'SETMUTED',
        chatnick: chatnick,
        muted: muted
        })
    }
  }