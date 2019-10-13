import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import ChatText from '../components/ChatText'
import store from '../store'

let testMessages = [
    {
        user: 'Jarppa',
        msg: 'Heippa'
    },
    {
        user: 'Samppa',
        msg: 'Moikka'
    }
]

let testUsers = [
    {
        chatnick: 'Jarppa'
    },
    {
        chatnick: 'Samppa'
    }
]

describe('ChatText tests', () => {

    let component

    beforeEach(() => {
          component = render(
            <Provider store={store} >
                <ChatText messages={testMessages} largeChat={true} visible={true} users={testUsers}/>
            </Provider>   
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('First message is rendered', () => {
        const first = component.getByText('Jarppa:')
        const second = component.getByText('Heippa')
        expect(first).toBeDefined()
        expect(second).toBeDefined()
    })
    test('Second message is rendered', () => {
        const first = component.getByText('Samppa:')
        const second = component.getByText('Moikka')
        expect(first).toBeDefined()
        expect(second).toBeDefined()
    })
})