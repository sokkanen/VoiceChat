import React from 'react'

const Chatrooms = () => {

    const createNew = (event) => {
        event.preventDefault()
        console.log('Hello')
    }

    return (
        <div>
            <div>
                <form onSubmit={createNew}>
                    Name: <input name="title"></input>
                    Description: <input name="desciption"></input>
                    <button type="submit">Create</button>
                </form>
            </div>
        </div>
    )
}

export default Chatrooms