import React from 'react'
import styles from './Room.module.css'
import { useParams } from 'react-router'
function Room() {

        const {roomId} = useParams()

        return (
                <div className='container'>
                        Single Room -{roomId}
                </div>
        )
}

export default Room