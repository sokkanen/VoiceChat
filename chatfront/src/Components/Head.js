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

    const [img, setImg] = useState(props.faces.defaultFace === null ? defaultFace : props.faces.defaultFace)
    useEffect(() => {


        if (props.images === undefined){
            if (aie.test(letter)){
                setImg(props.faces.defaultFace === null ? aieFace : props.faces.aieFace)
            } else if(bmp.test(letter.toLowerCase())){
                setImg(props.faces.defaultFace === null ? bmpFace : props.faces.aieFace)
            } else if (cdgknstxyz.test(letter.toLowerCase())){
                setImg(props.faces.defaultFace === null ? cdgknstxyzFace : props.faces.cdgknstxyzFace)
            } else if (fv.test(letter.toLowerCase())){
                setImg(props.faces.defaultFace === null ? fvFace : props.faces.fvFace)
            } else if (j.test(letter.toLowerCase())){
                setImg(props.faces.defaultFace === null ? jFace : props.faces.jFace)
            } else if (l.test(letter.toLowerCase())){
                setImg(props.faces.defaultFace === null ? lFace : props.faces.lFace)
            } else if (o.test(letter.toLowerCase())){
                setImg(props.faces.defaultFace === null ? oFace : props.faces.oFace)
            } else if (qw.test(letter.toLowerCase())){
                setImg(props.faces.defaultFace === null ? qwFace : props.faces.qwFace)
            } else if (r.test(letter.toLowerCase())){
                setImg(props.faces.defaultFace === null ? rFace : props.faces.rFace)
            } else if (u.test(letter.toLowerCase())){
                setImg(props.faces.defaultFace === null ? uFace : props.faces.uFace)
            } else {
                setImg(props.faces.defaultFace === null ? defaultFace : props.faces.defaultFace)
            }
        } else {
            if (aie.test(letter)){
                setImg(props.images.aieFace)
            } else if(bmp.test(letter.toLowerCase())){
                setImg(props.images.aieFace)
            } else if (cdgknstxyz.test(letter.toLowerCase())){
                setImg(props.images.cdgknstxyzFace)
            } else if (fv.test(letter.toLowerCase())){
                setImg(props.images.fvFace)
            } else if (j.test(letter.toLowerCase())){
                setImg(props.images.jFace)
            } else if (l.test(letter.toLowerCase())){
                setImg(props.images.lFace)
            } else if (o.test(letter.toLowerCase())){
                setImg(props.images.oFace)
            } else if (qw.test(letter.toLowerCase())){
                setImg(props.images.qwFace)
            } else if (r.test(letter.toLowerCase())){
                setImg(props.images.rFace)
            } else if (u.test(letter.toLowerCase())){
                setImg(props.images.uFace)
            } else {
                setImg(props.images.defaultFace)
            }
        }
    }, [letter, props.faces, props.images])
    
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
      user: state.user,
      faces: state.faces
    }
  }
  
const connectedHead = connect(mapStateToProps, null)(Head)
  
export default connectedHead