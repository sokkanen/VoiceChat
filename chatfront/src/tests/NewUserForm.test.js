import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import NewUserForm from '../components/NewUserForm'
import store from '../store'

describe('Loginform tests', () => {
    let component
    window.alert = jest.fn()
  
    beforeEach(async () => {
        let s = {}
        s.emit = () => window.alert('Emitted')
        s.on = () => null
        s.off = () => null

      component = render(
          <Provider store={store} >
            <NewUserForm socket={s}/>
          </Provider>   
      )
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('Register credentials are emitted with everything OK', async () => {
        const form = component.container.querySelector('.username')
        const form2 = component.container.querySelector('.email')
        const form3 = component.container.querySelector('.password')
        const form4 = component.container.querySelector('.password2')
        fireEvent.change(form, {target: {value: 'Jamppa'}})
        fireEvent.change(form2, {target: {value: 'jamppa@jampukka.fi'}})
        fireEvent.change(form3, {target: {value: '12345'}})
        fireEvent.change(form4, {target: {value: '12345'}})
        const button = component.getByText('Register')
        fireEvent.click(button)
        expect(window.alert).toBeCalled()
        expect(window.alert).toBeCalledWith('Emitted')
    })

    test('Register credentials are not emitted with non-matching passwords', async () => {
        const form = component.container.querySelector('.username')
        const form2 = component.container.querySelector('.email')
        const form3 = component.container.querySelector('.password')
        const form4 = component.container.querySelector('.password2')
        fireEvent.change(form, {target: {value: 'Jamppa'}})
        fireEvent.change(form2, {target: {value: 'jamppa@jampukka.fi'}})
        fireEvent.change(form3, {target: {value: '12345'}})
        fireEvent.change(form4, {target: {value: '12345443'}})
        const button = component.getByText('Register')
        fireEvent.click(button)
        expect(window.alert).toBeCalled()
        expect(window.alert).toBeCalledWith('Passwords must match')
    })

    test('Register credentials are not emitted with too short password', async () => {
        const form = component.container.querySelector('.username')
        const form2 = component.container.querySelector('.email')
        const form3 = component.container.querySelector('.password')
        const form4 = component.container.querySelector('.password2')
        fireEvent.change(form, {target: {value: 'Jamppa'}})
        fireEvent.change(form2, {target: {value: 'jamppa@jampukka.fi'}})
        fireEvent.change(form3, {target: {value: '1234'}})
        fireEvent.change(form4, {target: {value: '1234'}})
        const button = component.getByText('Register')
        fireEvent.click(button)
        expect(window.alert).toBeCalled()
        expect(window.alert).toBeCalledWith('Password must be at least 5 characters long')
    })

    test('Register credentials are not emitted with bad email', async () => {
        const form = component.container.querySelector('.username')
        const form2 = component.container.querySelector('.email')
        const form3 = component.container.querySelector('.password')
        const form4 = component.container.querySelector('.password2')
        fireEvent.change(form, {target: {value: 'Jamppa'}})
        fireEvent.change(form2, {target: {value: 'jamppa@jampukka'}})
        fireEvent.change(form3, {target: {value: '12345'}})
        fireEvent.change(form4, {target: {value: '12345'}})
        const button = component.getByText('Register')
        fireEvent.click(button)
        expect(window.alert).toBeCalled()
        expect(window.alert).toBeCalledWith('Invalid email-address')
    })

    test('Register credentials are not emitted with bad username', async () => {
        const form = component.container.querySelector('.username')
        const form2 = component.container.querySelector('.email')
        const form3 = component.container.querySelector('.password')
        const form4 = component.container.querySelector('.password2')
        fireEvent.change(form, {target: {value: 'Ja'}})
        fireEvent.change(form2, {target: {value: 'jamppa@jampukka.fi'}})
        fireEvent.change(form3, {target: {value: '12345'}})
        fireEvent.change(form4, {target: {value: '12345'}})
        const button = component.getByText('Register')
        fireEvent.click(button)
        expect(window.alert).toBeCalled()
        expect(window.alert).toBeCalledWith('Username must be between 3 and 15 characters.')
    })
})