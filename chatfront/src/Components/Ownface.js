import React, { useState, useEffect } from "react";
import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';

const Ownface = (props) => {

    const [image, setImage] = useState('')
    const [camera, setCamera] = useState(null)
    const [info, setInfo] = useState('Hi! Welcome to custom chatface builder! Click button to start taking your pictures!')
    const config = {}
    const photoRef = React.createRef();

    useEffect(() => {
        const cmra = new CameraPhoto(photoRef.current)
        setCamera(cmra)
        setImage(cmra.getDataUri(config))
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

    const takeUserImages = () => {
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
        setInfo(`say ${images[0]}!`)
        const start = (counter) => {
            if(counter < 12){
              setTimeout(() => {
                counter++;
                if (counter !== 12){
                    setInfo(`say ${images[counter-1]}!`)
                } else {
                    setInfo(images[counter-1])
                }
                takePhoto()
                start(counter);
              }, 2000);
            }
          }
          start(1);
    }

    const takePhoto = () => {
        const config = {
        sizeFactor: 1
        }
        let dataUri = camera.getDataUri(config);
        setImage(dataUri)
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
        <button onClick={() => {
            let facingMode = FACING_MODES.USER
            let idealResolution = { width: 320, height: 240 }
            startCamera(facingMode, idealResolution)
        }}> Turn on your camera </button>
        <button onClick={() => {stopCamera()}}> Turn off your camera </button>
        <video ref={photoRef} autoPlay={true}/>
        <img alt="CamPhoto" src={image}/>
        <button onClick={() => takeUserImages()}>Start taking your pictures!</button>
        <h1>{info}</h1>
    </div>
    );
}

export default Ownface