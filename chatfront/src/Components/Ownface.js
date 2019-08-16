import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';
import { setFaces } from '../Reducers/OwnFaceReducer'
import defaultFace from '../Images/1default.png'

const images = [
    'nothing! just smile',
    'aaaaaaa',
    'bbbbbbb',
    'ccccccc',
    'fffffff',
    'jjjjjjj',
    'lllllll',
    'ooooooo',
    'qqqqqqq',
    'rrrrrrr',
    'uuuuuuu',
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
        let facingMode = FACING_MODES.USER
        let idealResolution = { width: 320, height: 480 }
        await startCamera(facingMode, idealResolution)
        setInfo(`say ${images[0]}!`)
        const start = (counter) => {
            if(counter < 13){
              setTimeout( async () => {
                counter++;
                if (counter !== 13){
                    setInfo(`say ${images[counter-2]}!`)
                } else {
                    setInfo(images[counter-2])
                    if (window.confirm('Press OK if you are happy with your photos. Press Cancel to retake you photos.')){
                        stopCamera()
                        props.setFaces(initial)
                    } else {
                        takeUserImages()
                    }
                }
                takePhoto(counter)
                start(counter)
              }, 200) // HUOM! 2000
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
            case 2:
                initial.defaultFace = dataUri
                break
            case 3:
                initial.aieFace = dataUri
                break
            case 4:
                initial.bmpFace = dataUri
                break
            case 5:
                initial.cdgknstxyzFace = dataUri
                break
            case 6:
                initial.fvFace = dataUri
                break
            case 7:
                initial.jFace = dataUri
                break
            case 8:
                initial.lFace = dataUri
                break
            case 9:
                initial.oFace = dataUri
                break
            case 10:
                initial.qwFace = dataUri
                break
            case 11:
                initial.rFace = dataUri
                break
            case 12:
                initial.uFace = dataUri
                break
            default:
        }
    }

    const stopCamera = async () => {
        await camera.stopCamera()
        setImage(defaultFace)
    }

    return (
    <div>
        <video ref={photoRef} autoPlay={true}/>
        <img alt="CamPhoto" src={image}/>
        <h1>{info}</h1>
        <button onClick={() => takeUserImages()}>Start taking your pictures!</button>
    </div>
    );
}

const mapStateToProps = (state) => {
    return {
      faces: state.faces
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