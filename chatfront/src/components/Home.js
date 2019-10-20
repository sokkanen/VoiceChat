import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import backGroundImage from '../images/home.png'

const Home = (props) => {

  const [imageWidth, setImageWidth] = useState(props.windowSize.width * 0.5)
  
  useEffect(() => {
    setImageWidth(props.windowSize.width * 0.5)
  }, [props.windowSize])

  const style = { 
    padding: 10,
    margin: 45
  }

    return (
      <div style={style}>
          <h1>Welcome to the Voicechat!</h1>
          <img src={backGroundImage} alt="Welcome" width={imageWidth}></img>
          <em>          
            <h5>To get the most out of Voicechat, please make sure you have speech-synthesis and webcam enabled in your browser.</h5>
          </em>
      </div>
    )
}

const mapStateToProps = (state) => {
  return {
    windowSize: state.windowSize
  }
}

const mapDispatchToProps = {
}

const connectedHome = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)

export default connectedHome