import image2base64 from 'image-to-base64'

import defaultFace from './1default.png'
import aieFace from './1aei.png'
import bmpFace from './1bmp.png'
import fvFace from './1fv.png'
import jFace from './1j.png'
import lFace from './1l.png'
import oFace from './1o.png'
import qwFace from './1qw.png'
import rFace from './1r.png'
import uFace from './1u.png'
import cdgknstxyzFace from './1cdgknstxyz.png'

const convertToString = async (image) => {
    const b64 = await image2base64(image)
    return 'data:image/png;base64,' + b64
}

const initializer = async () => {

    const ret = {
      defaultFace : await convertToString(defaultFace),
      aieFace : await convertToString(aieFace),
      bmpFace : await convertToString(bmpFace),
      cdgknstxyzFace : await convertToString(cdgknstxyzFace),
      fvFace : await convertToString(fvFace),
      jFace : await convertToString(jFace),
      lFace : await convertToString(lFace),
      oFace : await convertToString(oFace),
      qwFace : await convertToString(qwFace),
      rFace : await convertToString(rFace),
      uFace : await convertToString(uFace) 
    } 
    return ret
}

export const initialize = () => {
    return initializer()
}