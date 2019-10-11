import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import io from 'socket.io-client';
import Chatrooms from '../components/Chatrooms'
import { Link } from 'react-router-dom'
import store from '../store'

describe('Chatrooms tests', () => {
    let component
    window.alert = jest.fn()
  
    beforeEach(() => {
    const socket = io('ws://localhost:3003', {transports: ['websocket'], upgrade: false})
      component = render(
          <Provider store={store} >
                <Chatrooms Link={Link} socket={socket}/>
          </Provider>   
      )
    })
  
    test('after clicking the button, alert is displayed', () => {
      const button = component.getByText('Set nickname')
      fireEvent.click(button)
      setTimeout(() => {
        expect(window.alert).toBeCalled()
      }, 1000);
    })
})