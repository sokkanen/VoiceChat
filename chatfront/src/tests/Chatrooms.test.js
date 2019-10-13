import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import io from 'socket.io-client';
import Chatrooms from '../components/Chatrooms'
import { Link } from 'react-router-dom'
import store from '../store'

let testRooms = [
    {
        id: "ef550b00-d670-11e9-8cae-5f3973579bd7",
        name: "eka huone",
        description: "ekan huoneen seloste",
        private: false,
        owner_id: "662451e0-c443-11e9-9c9d-474d2fe5e42d",
        user_limit: 5,
        full: false
    },
    {
        id: "75ca35b0-c443-11e9-9c9d-474d2fe5e42d",
        name: "toka huone",
        description: "tokan huoneen seloste",
        private: false,
        owner_id: "662451e0-c443-11e9-9c9d-474d2fe5e42d",
        user_limit: 5,
        full: false
    }
]

describe('Chatrooms tests', () => {
    let component
    window.alert = jest.fn()

    beforeAll(async () => {
        await store.dispatch({type: 'SETROOMS', data: testRooms})
        await store.dispatch({type: 'SETFULLROOMS', data: [testRooms[0].name]})
    })
  
    beforeEach(async () => {
    const socket = io('ws://localhost:3003', {transports: ['websocket'], upgrade: false})
      component = render(
          <Provider store={store} >
                <Chatrooms Link={Link} socket={socket}/>
          </Provider>   
      )
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
  
    test('after clicking the button, alert is displayed', () => {
      const button = component.getByText('Set nickname')
      fireEvent.click(button)
      expect(window.alert).toBeCalled()
      expect(window.alert).toBeCalledWith('Nickname must be between 3 and 15 characters.')
    })

    test('nickname is set correctly', () => {
        const form = component.container.querySelector('.chatnick')
        fireEvent.submit(form, { target: {chatnick: {value: 'Jarppa'}}})
        expect(window.alert).not.toBeCalled()
    })

    test('Rooms are rendered correctly', () => {
        const first = component.getByText('eka huone')
        const second = component.getByText('toka huone')
        expect(first).toBeDefined()
        expect(second).toBeDefined()
    })

    test('Full room is described full', () => {
        const first = component.getByText('Room is Full')
        expect(first).toBeDefined()
    })
})