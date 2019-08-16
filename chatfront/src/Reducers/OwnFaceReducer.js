const ownFaceReducer = (state = [], action) => {
    switch (action.type) {
      case 'SETFACES':
        return action.data
      case 'REMOVEFACES':
        return []
      default: return state
    }
  }
  
  export default ownFaceReducer
  
  export const setFaces = (images) => {
    return async dispatch => {
      dispatch ({
        type: 'SETFACES',
        data: images
        })
    }
  }

  export const removeFaces = () => {
    return async dispatch => {
      dispatch ({
        type: 'REMOVEFACES'
        })
    }
  }