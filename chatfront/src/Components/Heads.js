import React from 'react'
import Head from './Head'

const Heads = ({users, letter, speaking}) => {
    if (users.length === 0){
        users[0] = {name: 'Anonymous'}
    }
    console.log(speaking)
    return (
        <div>
            <table>
                <tr>
                {users.map(
                    user => user.name === speaking ? <td><Head letter={letter} user={user.name}/></td> : <td><Head letter='' user={user.name}/></td>
                )}
                </tr>
            </table>
        </div>
    )
}

export default Heads