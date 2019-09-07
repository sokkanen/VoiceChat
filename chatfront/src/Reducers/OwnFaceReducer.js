import defaultFace from '../Images/1default.png'
import aieFace from '../Images/1aei.png'
import bmpFace from '../Images/1bmp.png'
import fvFace from '../Images/1fv.png'
import jFace from '../Images/1j.png'
import lFace from '../Images/1l.png'
import oFace from '../Images/1o.png'
import qwFace from '../Images/1qw.png'
import rFace from '../Images/1r.png'
import uFace from '../Images/1u.png'
import cdgknstxyzFace from '../Images/1cdgknstxyz.png'

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