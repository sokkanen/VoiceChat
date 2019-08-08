
const ownFaceReducer = (state = [], action) => {
    switch (action.type) {
      case 'SETFACES':
          const faces = state
          faces.push(action.data)
          return faces
      default: return state
    }
  }
  
  export default ownFaceReducer
  
  export const setFaces = (faces) => {
    return async dispatch => {
      dispatch ({
        type: 'SETFACES',
        data: faces
        })
    }
  }