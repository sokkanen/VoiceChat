const notificationReducer = (state = '', action) => {
    switch (action.type) {
      case 'SETNOTIFICATION':
        return action.data
      default: return state
    }
  }
  
  export default notificationReducer
  
  export const setNotification = (notification) => {
    return async dispatch => {
      dispatch ({
        type: 'SETNOTIFICATION',
        data: notification
        })
    }
  }