import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import Room from '../components/Room'
import store from '../store'

let testUsers = [
    {
        id: "ef550b00-d670-11e9-8cae-5f3973579bd7",
        chatnick: "testaaja",
        room: "Testihuone",
        oldroom: null,
        registered: false,
        images: [],
        typing: false,
        muted: false
    },
    {
        id: "75ca35b0-c443-11e9-9c9d-474d2fe5e42d",
        chatnick: "testaaja2",
        room: "Testihuone",
        oldroom: null,
        registered: false,
        images: [],
        typing: false,
        muted: false
    }
]

describe('Chatrooms tests', () => {
    let component
    window.alert = jest.fn()
    window.speechSynthesis = jest.fn()

    beforeAll(async () => {
        await store.dispatch({type: 'SETUSERS', data: testUsers})
        await store.dispatch({type: 'SETROOM', data: "Testihuone"})
        await store.dispatch({type: 'SETCHATNICK', data: "testaaja"})
    })
  
    beforeEach(async () => {
        let s = {}
        s.emit = (type, content) => window.alert(type, content)
        s.on = () => null
        s.off = () => null
      component = render(
          <Provider store={store} >
                <Room room="Testihuone" socket={s}/>
          </Provider>   
      )
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
  
    test('User-message is emitted correctly', () => {
      const form = component.container.querySelector('.submit-form')
      const button = component.getByText('Send')

        fireEvent.change(form, {target: {value: 'Hello world!'}})
        fireEvent.click(button)
        
        const msg = {
            user: 'testaaja',
            message: 'Hello world!',
            room: 'Testihuone'
        }
        expect(window.alert).toBeCalled()
        expect(window.alert).toBeCalledWith('newMessage', msg) 
    })

    test('Empty message is not emitted', () => {
        const form = component.container.querySelector('.submit-form')
        const button = component.getByText('Send')
        fireEvent.change(form, {target: {value: ''}})
        fireEvent.click(button)
        expect(window.alert).not.toBeCalled()
    })

    test('Too long message is not emitted', () => {
        const form = component.container.querySelector('.submit-form')
        const button = component.getByText('Send')
        fireEvent.change(form, {target: {value: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz' + 
        'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz' + 
        'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'}})
        fireEvent.click(button)
        expect(window.alert).toBeCalledWith("typing", "Testihuone")
    })

    test('Both users are rendered', () => {
        const u1 = component.getByText('testaaja')
        const u2 = component.getByText('testaaja2')
        expect(u1).toBeDefined()
        expect(u2).toBeDefined()
    })
})