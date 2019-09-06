import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';
import { setFaces } from '../Reducers/OwnFaceReducer'
import { Jumbotron, Container, Row, Col, Image, Button, Badge } from 'react-bootstrap'
import cameraImage from '../Images/camera.png'
import userImage from '../Images/user.png'

const images = [
    'Smile!',
    'Say A!',
    'Say B!',
    'Say C!',
    'Say F!',
    'Say J!',
    'Say L!',
    'Say O!',
    'Say Q!',
    'Say R!',
    'Say U!',
    'All set!'
]

const Ownface = (props) => {
    const [image, setImage] = useState(userImage)
    const [camera, setCamera] = useState(null)
    const [info, setInfo] = useState('')
    const [videoVisible, setVideoVisible] = useState(false)
    const photoRef = React.createRef()

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
        await camera.startCamera(idealFacingMode, idealResolution)
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
                takePhoto(counter)
                counter++;
                if (counter === 13){
                    if (window.confirm('Press OK if you are happy with your photos. Press Calcel to continue without saving your photos.')){
                        stopCamera()
                        props.setFaces(initial)
                        props.socket.emit('userImages', initial, props.user)
                        setInfo('All set!')
                    } else {
                        stopCamera()
                        setInfo('')
                    }
                }
                start(counter)
              }, 2000)
            }
          }
          start(1)
    }

    const takePhoto = (index) => {
        console.log(index)
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
       
        marginBottom: 45
    }

    return (
        <div style={style}>
            <Container>
                <Row>
                    <Jumbotron fluid>
                        <Container>
                            <Row>
                                <h3>'Hi! Welcome to the custom chatface builder! Click on camera below to start taking your pictures!'</h3>
                                <p>Please make sure you have your webcam enabled.</p>
                            </Row>
                            <Row>
                                <Col></Col>
                                <Col>
                                    <Image onClick={() => takeUserImages()} src={cameraImage} width={props.windowSize.width / 3}/>
                                </Col>
                                <Col></Col>
                            </Row>
                        </Container>
                    </Jumbotron> 
                </Row>
                <Row>
                <Col></Col>
                <Col>
                {info !== '' 
                ? <Badge variant="success"><h2>{info}</h2></Badge> 
                : <Button variant="outline-success" onClick={startCamera}><h3>test your camera!</h3></Button>}
                </Col>
                <Col></Col>
                </Row>
                    <Row>
                        <Col>
                            <h5>Your most recent photo</h5>
                            <Image src={image} style={{width: 240, height: 240}} rounded />
                        </Col>
                        <Col>
                        </Col>
                        <Col>
                            <h5>Live camera feed</h5>
                            <video ref={photoRef} autoPlay={true}/>
                            
                        </Col>
                    </Row>
            </Container>
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
      setFaces
  }
  
  const connectedOwnFace = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Ownface)
  
  export default connectedOwnFace