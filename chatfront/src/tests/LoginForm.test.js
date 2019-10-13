import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import io from 'socket.io-client';
import LoginForm from '../components/LoginForm'
import store from '../store'

describe('Loginform tests', () => {
    let component
    window.alert = jest.fn()
  
    beforeAll(async () => {
        let s = {}
        s.emit = () => window.alert('Emitted')
        s.on = () => null
        s.off = () => null

      component = render(
          <Provider store={store} >
            <LoginForm socket={s}/>
          </Provider>   
      )
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('Login credentials are emitted', async () => {
        const form = component.container.querySelector('.username')
        const form2 = component.container.querySelector('.password')
        fireEvent.change(form, {target: {value: 'Jamppa'}})
        fireEvent.change(form2, {target: {value: '12345678'}})
        const button = component.getByText('Login')
        fireEvent.click(button)
        expect(window.alert).toBeCalled()
        expect(window.alert).toBeCalledWith('Emitted')
    })
})