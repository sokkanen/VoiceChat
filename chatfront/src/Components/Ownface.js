import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';
import { setFaces } from '../Reducers/OwnFaceReducer'
import defaultFace from '../Images/1default.png'

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
    const [image, setImage] = useState(defaultFace)
    const [camera, setCamera] = useState(null)
    const [info, setInfo] = useState('Hi! Welcome to custom chatface builder! Click button to start taking your pictures!')
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

    const startCamera = async (idealFacingMode, idealResolution) => {
        await camera.startCamera(idealFacingMode, idealResolution)
    }

    const takeUserImages = async () => {
        setInfo(images[0])
        let facingMode = FACING_MODES.USER
        let idealResolution = { width: 240, height: 320 }
        await startCamera(facingMode, idealResolution)
        const start = (counter) => {
            if(counter < 13){
              setTimeout( async () => {
                setInfo(images[counter])
                takePhoto(counter)
                counter++;
                if (counter === 13){
                    if (window.confirm('Press OK if you are happy with your photos. Press Cancel to retake you photos.')){
                        stopCamera()
                        props.setFaces(initial)
                        props.socket.emit('userImages', initial, props.user)
                        setInfo('All set!')
                    } else {
                        takeUserImages()
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
        setImage(defaultFace)
    }

    const style = { 
        padding: 10,
        margin: 45
    }

    return (
    <div style={style}>
        <video ref={photoRef} autoPlay={true}/>
        <img alt="CamPhoto" src={image}/>
        <h1>{info}</h1>
        <button onClick={() => takeUserImages()}>Start taking your pictures!</button>
    </div>
    );
}

const mapStateToProps = (state) => {
    return {
      faces: state.faces,
      user: state.user
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