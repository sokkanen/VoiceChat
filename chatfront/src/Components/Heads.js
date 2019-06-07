import React from 'react'
import Head from './Head'

const Heads = ({users, letter, speaking}) => {
    if (users.length === 0){
        users[0] = {name: 'Anonymous'}
    }
    return (
        <div>
            <table>
                <tbody>
                <tr>
                {users.map(
                    user => user.name === speaking ? 
                    <td key={user.name}><Head letter={letter} user={user.name}/></td> : 
                    <td key={user.name}><Head letter='' user={user.name}/></td>
                )}
                </tr>              
                </tbody>
            </table>
        </div>
    )
}

export default Heads