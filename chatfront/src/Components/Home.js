import React from 'react'
import backGroundImage from '../Images/home.png'

const Home = () => {

  const nonChromeInfo = () => {
    return (
      <div>
        <h5>This application is guaranteed to work with the latest versions of Google Chrome and Chromium -browsers.</h5>
        <h5>Please consider switching to one of these browsers in order to use all the features of the application.</h5>
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
          <img src={backGroundImage} alt="Welcoming image"></img>
          <div>
            {navigator.userAgent.toLowerCase().includes('chrome') ? 
            null : 
            nonChromeInfo()}
          </div>
      </div>
    )
}

export default Home