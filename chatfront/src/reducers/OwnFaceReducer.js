import defaultFace from '../images/1default.png'
import aieFace from '../images/1aei.png'
import bmpFace from '../images/1bmp.png'
import fvFace from '../images/1fv.png'
import jFace from '../images/1j.png'
import lFace from '../images/1l.png'
import oFace from '../images/1o.png'
import qwFace from '../images/1qw.png'
import rFace from '../images/1r.png'
import uFace from '../images/1u.png'
import cdgknstxyzFace from '../images/1cdgknstxyz.png'

const initial = {
  defaultFace : defaultFace,
  aieFace : aieFace,
  bmpFace : bmpFace,
  cdgknstxyzFace : cdgknstxyzFace,
  fvFace : fvFace,
  jFace : jFace,
  lFace : lFace,
  oFace : oFace,
  qwFace : qwFace,
  rFace : rFace,
  uFace : uFace 
}

const ownFaceReducer = (state = initial, action) => {
    switch (action.type) {
      case 'SETFACES':
        return action.data
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