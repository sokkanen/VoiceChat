import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import CircularJSON from 'circular-json'
import { Provider } from 'react-redux'
import NewRoomForm from '../components/NewRoomForm'
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
            <NewRoomForm socket={s} visible={true}/>
          </Provider>   
      )
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('New room creation is not available for unregistered', () => {
        const info = CircularJSON.stringify(component.getByText('Please Login / Register to create a new chatroom.'))
        expect(info).toContain('Please Login / Register to create a new chatroom.')
    })

    test('New room form is visible to logged in user', async () => {
        await store.dispatch({type: 'SETUSER', data: "Testihenkilo"})
        const title = component.getByText('Title / Name')
        const desc = component.getByText('Additional information:')
        const priv = component.getByText('Private')
        const limit = component.getByText('User limit')
        const button = component.getByText('Create')
        expect(title).not.toBe(undefined)
        expect(desc).not.toBe(undefined)
        expect(priv).not.toBe(undefined)
        expect(limit).not.toBe(undefined)
        expect(button).not.toBe(undefined)
    })
})