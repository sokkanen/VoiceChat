import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';
import { Jumbotron, Container, Row, Col, Image, Button, Badge, Card, CardColumns } from 'react-bootstrap'
import { Zoom } from 'react-reveal'
import Speech from 'speak-tts'
import cameraImage from '../images/camera.png'
import userImage from '../images/user.png'

const images = [
    'Just Smile!',
    `Say 'A'!`,
    `Say 'B'!`,
    `Say 'C'!`,
    `Say 'F'!`,
    `Say 'J'!`,
    `Say 'L'!`,
    `Say 'O'!`,
    `Say 'Q'!`,
    `Say 'R'!`,
    `Say 'U'!`,
    'All set!'
]

const Ownface = (props) => {
    const [image, setImage] = useState(userImage)
    const [camera, setCamera] = useState(null)
    const [info, setInfo] = useState('')
    const [videoVisible, setVideoVisible] = useState(false)
    const photoRef = React.createRef()

    const speech = new Speech()

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

    useEffect(() => {
        const cmra = new CameraPhoto(photoRef.current)
        setCamera(cmra)
    }, [])

    const startCamera = async () => {
        let idealFacingMode = FACING_MODES.USER
        let idealResolution = { width: 240, height: 240 }
        const result = await camera.startCamera(idealFacingMode, idealResolution)
        return result
    }

    const testCamera = async () => {
        const success = await startCamera()
        if (success.active){
            window.alert('Your camera seem to be working fine.')
        } else {
            window.alert(`There's something wrong with your camera. Make sure you have enabled your webcam in your browser.`)
        }
        stopCamera()
    }

    const takeUserImages = async () => {
        await setVideoVisible(true)
        window.scrollTo(0,document.body.scrollHeight);
        setInfo(images[0])
        await startCamera()
        const start = (counter) => {
            if(counter < 13){
              setTimeout( async () => {
                setInfo(images[counter])
                speech.speak({
                    text: images[counter],
                    queue: true,
                })
                takePhoto(counter)
                counter++;
                if (counter === 13){
                    if (window.confirm('Press OK if you are happy with your photos. Press Cancel to continue without saving your photos.')){
                        stopCamera()
                        props.socket.emit('userImages', initial, props.user)
                        setInfo('All set!')
                        setVideoVisible(false)
                        window.scrollTo(0,0);
                    } else {
                        stopCamera()
                        setInfo('')
                        setVideoVisible(false)
                        window.scrollTo(0,0);
                    }
                }
                start(counter)
              }, 2500)
            }
          }
          start(1)
    }

    const takePhoto = (index) => {
        const config = {
          sizeFactor: 1
        }
        let dataUri = camera.getDataUri(config);
        setImage(dataUri)
        switch (index) {
            case 1:
                initial.defaultFace = dataUri
                break
            case 2:
                initial.aieFace = dataUri
                break
            case 3:
                initial.bmpFace = dataUri
                break
            case 4:
                initial.cdgknstxyzFace = dataUri
                break
            case 5:
                initial.fvFace = dataUri
                break
            case 6:
                initial.jFace = dataUri
                break
            case 7:
                initial.lFace = dataUri
                break
            case 8:
                initial.oFace = dataUri
                break
            case 9:
                initial.qwFace = dataUri
                break
            case 10:
                initial.rFace = dataUri
                break
            case 11:
                initial.uFace = dataUri
                break
            default:
        }
    }

    const stopCamera = async () => {
        await camera.stopCamera()
        setImage(userImage)
    }

    const style = { 
        padding: 10,
        marginBottom: 45,
        width: props.windowSize.width * 0.8, 
        margin: '15px'
    }

    return (
        <div style={style}>
            <Zoom bottom when={!videoVisible}>
            <Jumbotron fluid>
                <Container>
                    <Row>
                        <h3>'Hi! Welcome to the custom chatface builder! Click on camera below to start taking your pictures!'</h3>
                        <p>Please make sure you have your webcam enabled.</p>
                    </Row>
                    <Row>
                        <Col>
                            <Image onClick={() => takeUserImages()} src={cameraImage} width={props.windowSize.width / 5}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="outline-success" onClick={testCamera}><h3>test your camera!</h3></Button>
                        </Col>
                    </Row>
                </Container>
            </Jumbotron> 
            </Zoom>
            <Zoom top when={videoVisible}>
                <Jumbotron fluid>
                <CardColumns>
                    <Card>
                        <Card.Body>
                        <Card.Img src={image} style={{width: 240, height: 240}} />
                            <Card.Title>Your most recent photo</Card.Title>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title>Smile and...</Card.Title>
                            <Badge variant="success"><h2>{info}</h2></Badge>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                        <video ref={photoRef} autoPlay={true}/>
                            <Card.Title>Live camera feed</Card.Title>
                        </Card.Body>
                    </Card>
                </CardColumns>
                </Jumbotron>
            </Zoom>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      faces: state.faces,
      user: state.user,
      windowSize: state.windowSize
    }
  }
  
  const mapDispatchToProps = {
  }
  
  const connectedOwnFace = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Ownface)
  
  export default connectedOwnFace