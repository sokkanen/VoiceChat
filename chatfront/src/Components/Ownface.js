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
    const photoRef = React.createRef();

    useEffect(() => {
        const cmra = new CameraPhoto(photoRef.current)
        setCamera(cmra)
    }, [])

    const startCamera = (idealFacingMode, idealResolution) => {
        camera.startCamera(idealFacingMode, idealResolution)
        .then(() => {
            console.log('camera on!');
        })
        .catch((error) => {
            console.error('Error in turning on the camera!', error);
        });
    }

    const takeUserImages = async () => {
        let facingMode = FACING_MODES.USER
        let idealResolution = { width: 320, height: 480 }
        await startCamera(facingMode, idealResolution)
        setInfo(`say ${images[0]}!`)
        const start = (counter) => {
            if(counter < 12){
              setTimeout( async () => {
                counter++;
                if (counter !== 12){
                    setInfo(`say ${images[counter-1]}!`)
                } else {
                    setInfo(images[counter-1])
                    if (window.confirm('Press OK if you are happy with your photos. Press Cancel to retake you photos.')){
                        stopCamera()
                    } else {
                        takeUserImages()
                    }
                }
                takePhoto(counter)
                start(counter)
              }, 2000);
            }
          }
          start(1)
    }

    const takePhoto = (index) => {
        console.log(index)
        if (index !== 12){
            const config = {
                sizeFactor: 1
                }
                let dataUri = camera.getDataUri(config);
                const imageInfo = {
                    index: index-2,
                    image: dataUri
                }
                setImage(dataUri)
                props.setFaces(imageInfo) // LÄHETETTÄVÄ KAIKKI KERRALLA BÄKKÄRILLE JA REDUXILLE.
        } else {
            setImage(defaultFace)
        }
    }

    const stopCamera = () => {
        camera.stopCamera()
        .then(() => {
            console.log('Camera stopped!');
        })
        .catch((error) => {
            console.log('No camera to stop!:', error);
        })
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