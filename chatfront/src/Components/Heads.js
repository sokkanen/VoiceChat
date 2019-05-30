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
                <tbody>
                <tr>
                {users.map(
                    user => user.name === speaking ? 
                    <td><Head key={user.name} letter={letter} user={user.name}/></td> : 
                    <td><Head key={user.name} letter='' user={user.name}/></td>
                )}
                </tr>              
                </tbody>
            </table>
        </div>
    )
}

export default Heads