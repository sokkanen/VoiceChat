import React, { useState, useEffect } from 'react'
import { Badge, Card } from 'react-bootstrap'
import { Zoom } from 'react-reveal'
import { connect } from 'react-redux'
import defaultFace from '../Images/1default.png'

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
    const faces = props.faces

    useEffect(() => {
        if (props.images === undefined){
            if (aie.test(letter)){
                setImg(faces.aieFace)
            } else if(bmp.test(letter.toLowerCase())){
                setImg(faces.bmpFace)
            } else if (cdgknstxyz.test(letter.toLowerCase())){
                setImg(faces.cdgknstxyzFace)
            } else if (fv.test(letter.toLowerCase())){
                setImg(faces.fvFace)
            } else if (j.test(letter.toLowerCase())){
                setImg(faces.jFace)
            } else if (l.test(letter.toLowerCase())){
                setImg(faces.lFace)
            } else if (o.test(letter.toLowerCase())){
                setImg(faces.oFace)
            } else if (qw.test(letter.toLowerCase())){
                setImg(faces.qwFace)
            } else if (r.test(letter.toLowerCase())){
                setImg(faces.rFace)
            } else if (u.test(letter.toLowerCase())){
                setImg(faces.uFace)
            } else {
                setImg(faces.defaultFace)
            }
        } else {
            if (aie.test(letter)){
                setImg(props.images.aieFace)
            } else if(bmp.test(letter.toLowerCase())){
                setImg(props.images.bmpFace)
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
    }, [letter, faces, props.images])
    
    if (registered){
        return (
            <Zoom bottom>
            <Card bg="light" border="dark" text="primary">
                <Card.Header>{chatnick}</Card.Header>
                <Card.Body>
                <Card.Img class="rounded-circle img-fluid" src={img}/>
                <Card.Title><Badge variant="secondary">{props.typing === true ? 'Typing' : 'Idle'}</Badge></Card.Title>
                </Card.Body>
            </Card>
            </Zoom>
        )  
    }

    return (
        <Zoom bottom>
        <Card bg="light" border="dark">
            <Card.Header>{chatnick}</Card.Header>
            <Card.Body>
            <Card.Img className="rounded-circle img-fluid" src={img}/>
            <Card.Title><Badge variant="light">{props.typing === true ? 'Typing' : 'Idle'}</Badge></Card.Title>
            </Card.Body>
        </Card>
        </Zoom>
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