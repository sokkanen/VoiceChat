import React from 'react'
import { connect } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import './Forms.css'

const NewRoomForm = (props) => {

    const socket = props.socket
    const visible = props.visible

    const createNew = async (event) => {
        event.preventDefault()
        if (validate(event.target)){
            const room = {
                title: event.target.title.value,
                description: event.target.description.value,
                private: event.target.private.value === 'YES' ? true : false,
                user_limit: event.target.user_limit.value
            }
            event.target.title.value = ''
            event.target.description.value = ''
            event.target.private.value = 'NO'
            event.target.user_limit.value = '5'
            if (room.title === ''){
                alert(`New room must have a title!`)
            } else {
                const usr = {
                    name: props.user,
                    token: JSON.parse(window.localStorage.getItem('user')).token
                }
                await socket.emit('newRoom', room, usr)
                socket.emit('requestRooms', JSON.parse(window.localStorage.getItem('user')).id)
            }
        }
    }

    const validate = (target) => {
        const title = target.title.value
        const description = target.description.value
        if (title.length < 5 || title.length > 128){
            alert('Room title must be between 5 and 128 characters')
            return false
        } else if (description.length > 256){
            alert('Maximum length for description is 256 characters.')
            return false
        }
        return true
    }

    if (!visible){
        return <div></div>
    }

    if (props.user === ''){
        return (
            <div style={{border:'5px solid #cecece', padding: '20px', backgroundColor: '#dfe7eb'}}>
            <h4 style={{border:'2px solid #8bc9e8', padding: '20px'}}>Please Login / Register to create a new chatroom.</h4>
            <Button variant="success" disabled>
                Create
            </Button>
            </div>
        )
    }

    return (
        <div style={{border:'5px solid #cecece', padding: '20px', backgroundColor: '#dfe7eb'}}>
        <Form onSubmit={createNew}>
        <h4 style={{border:'2px solid #8bc9e8', padding: '20px'}}>New room creation</h4>
            <Form.Group controlId="title">
                <Form.Label>Title / Name</Form.Label>
                <Form.Control name="title" placeholder="Title / Name"/>
            </Form.Group>
            <Form.Group controlId="description">
                <Form.Label>Additional information:</Form.Label>
                <Form.Control name="description" as="textarea" rows="3" placeholder="Additional information..."/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Private</Form.Label>
                <div key={`private`} className="mb-3">
                <Form.Check inline label="Yes" type="radio" name="private" value="YES" id={`inline-radio-1`} />
                <Form.Check inline label="No" type="radio" name="private" value="NO" defaultChecked id={`inline-radio-2`} />
                </div>
            </Form.Group>
            <Form.Group>
                <Form.Label>User limit</Form.Label>
                <div key={`user_limit`} className="mb-3">
                <Form.Check inline label="2" type="radio" name="user_limit" value="2" id={`radio-1`} />
                <Form.Check inline label="5" type="radio" name="user_limit" value="5" defaultChecked id={`radio-2`} />
                <Form.Check inline label="10" type="radio" name="user_limit" value="10" id={`radio-3`} />
                <Form.Check inline label="999" type="radio" name="user_limit" value="999" id={`radio-4`} />
                </div>
            </Form.Group>
            <Button variant="success" type="submit">
                Create
            </Button>
        </Form>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      user: state.user
    }
  }
  
  const connectedNewRoomForm = connect(mapStateToProps, null)(NewRoomForm)
  
  export default connectedNewRoomForm



