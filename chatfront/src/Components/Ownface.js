import React, { useState, useEffect } from "react";
import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';

const Ownface = (props) => {

    const [dataUri, setDataUri] = useState('')
    const [camera, setCamera] = useState(null)
    const config = {}
    const photoRef = React.createRef();

    useEffect(() => {
        const cmra = new CameraPhoto(photoRef.current)
        setCamera(cmra)
        setDataUri(cmra.getDataUri(config))
    }, [])

    const startCamera = (idealFacingMode, idealResolution) => {
        camera.startCamera(idealFacingMode, idealResolution)
        .then(() => {
            console.log('camera is started !');
        })
        .catch((error) => {
            console.error('Camera not started!', error);
        });
    }

    const takePhoto = () => {
        const config = {
        sizeFactor: 1
        }
        let dataUri = camera.getDataUri(config);
        setDataUri(dataUri)
    }

    const stopCamera = () => {
        camera.stopCamera()
        .then(() => {
            console.log('Camera stoped!');
        })
        .catch((error) => {
            console.log('No camera to stop!:', error);
        })
    }
    return (
    <div>
        <button onClick={() => {
            let facingMode = FACING_MODES.USER
            let idealResolution = { width: 640, height: 480 }
            startCamera(facingMode, idealResolution)
        }}> Video on </button>

        <button onClick={() => {takePhoto()}}> Take photo </button>

        <button onClick={() => {stopCamera()}}> Stop video </button>
        <video ref={photoRef} autoPlay="true"/>
        <img alt="CamPhoto" src={dataUri}
        />
    </div>
    );
}

export default Ownface