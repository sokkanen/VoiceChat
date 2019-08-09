let initial = {
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
          const faces = state
          switch (action.data.index) {
            case 0:
              return {...faces, defaultFace: action.data.image}
            case 1:
              return {...faces, aieFace: action.data.image}
            case 2:
              return {...faces, bmpFace: action.data.image}
            case 3:
              return {...faces, cdgknstxyzFace: action.data.image}
            case 4:
              return {...faces, fvFace: action.data.image}
            case 5:
              return {...faces, jFace: action.data.image}
            case 6:
              return {...faces, lFace: action.data.image}
            case 7:
              return {...faces, oFace: action.data.image}
            case 8:
              return {...faces, qwFace: action.data.image}
            case 9:
              return {...faces, rFace: action.data.image}
            case 10:
              return {...faces, uFace: action.data.image}
            default:
              break
          }
        break
      case 'REMOVEFACES':
        return initial
      default: return state
    }
  }
  
  export default ownFaceReducer
  
  export const setFaces = (imageInfo) => {
    return async dispatch => {
      dispatch ({
        type: 'SETFACES',
        data: imageInfo
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