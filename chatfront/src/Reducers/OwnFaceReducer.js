const initial = {
  defaultFace : null,
  aieFace : null,
  bmpFace : null,
  cdgknstxyzFace : null,
  fvFace : null,
  jFace : null,
  lFace : null,
  oFace : null,
  qwFace : null,
  rFace : null,
  uFace : null 
}

const ownFaceReducer = (state = initial, action) => {
    switch (action.type) {
      case 'SETFACES':
        return action.data
      case 'REMOVEFACES':
        return initial
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