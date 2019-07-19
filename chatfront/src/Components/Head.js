import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
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

const aie = /[aieä]/
const bmp = /[bmp]/
const cdgknstxyz = /[cdgknstxyz]/
const fv = /[fv]/
const j = /[j]/
const l = /[l]/
const o = /[oö]/
const qw = /[qw]/
const r = /[r]/
const u = /[u]/

const Head = (props) => {

    const chatnick = props.chatnick
    const letter = props.letter
    const registered = props.registered
    const user = props.user // Jos haluaa "itselle jotain erityistä merkkiä"

    const [img, setImg] = useState(defaultFace)
    useEffect(() => {
        if (aie.test(letter)){
            setImg(aieFace)
        } else if(bmp.test(letter)){
            setImg(bmpFace)
        } else if (cdgknstxyz.test(letter)){
            setImg(cdgknstxyzFace)
        } else if (fv.test(letter)){
            setImg(fvFace)
        } else if (j.test(letter)){
            setImg(jFace)
        } else if (l.test(letter)){
            setImg(lFace)
        } else if (o.test(letter)){
            setImg(oFace)
        } else if (qw.test(letter)){
            setImg(qwFace)
        } else if (r.test(letter)){
            setImg(rFace)
        } else if (u.test(letter)){
            setImg(uFace)
        } else {
            setImg(defaultFace)
        }
    }, [letter])
    
    if (registered){
        return (
            <div>
                <img src={img} alt="Cartoon head"></img>
                <h3 style={{ color: 'green' }}>{chatnick}</h3>
            </div>
        )
    }

    return (
        <div>
            <img src={img} alt="Cartoon head"></img>
            <h4>{chatnick}</h4>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      user: state.user
    }
  }
  
const connectedHead = connect(mapStateToProps, null)(Head)
  
export default connectedHead