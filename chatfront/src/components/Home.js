import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import backGroundImage from '../images/home.png'

const Home = (props) => {

  const [imageWidth, setImageWidth] = useState(props.windowSize.width * 0.65)
  
  useEffect(() => {
    setImageWidth(props.windowSize.width * 0.65)
  }, [props.windowSize])

  const nonChromeInfo = () => {
    return (
      <div>
        <h5>This application is guaranteed to work with the latest versions of Google Chrome and Chromium -browsers.</h5>
        <h5>Please consider switching to one of these browsers in order to use all the features of the application...</h5>
      </div>
    )
  }

  const style = { 
    padding: 10,
    margin: 45
  }

    return (
      <div style={style}>
          <h1>Welcome to voicechat!</h1>
          <img src={backGroundImage} alt="Welcome" width={imageWidth}></img>
          <div>
            {navigator.userAgent.toLowerCase().includes('chrome') ? 
            null : 
            nonChromeInfo()}
          </div>
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