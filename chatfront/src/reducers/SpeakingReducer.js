const speakingReducer = (state = '', action) => {
    switch (action.type) {
      case 'SETSPEAKING':
        return action.data
      default: return state
    }
  }
  
  export default speakingReducer

  export const setSpeaking = (speaking) => {
    return async dispatch => {
      dispatch ({
        type: 'SETSPEAKING',
        data: speaking
        })
    }
  }