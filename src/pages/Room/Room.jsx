import React, { useState } from 'react'
import styles from './Room.module.css'
import { useParams } from 'react-router'
import { useWebRTC } from '../../hooks/useWebRTC'
import { useSelector } from 'react-redux'
function Room() {
        
        const {roomId} = useParams()
        const {user} = useSelector((store)=>store.auth)

        const {clients,provideRef} = useWebRTC(roomId,user)


        return (
                <div >
                       <h1>All Connected Clients</h1>
                       {
                                clients && clients.map((client)=>{
                                        return (<div key={client?._id+"client"}>
                                                <audio 
                                                        controls
                                                        autoPlay
                                                        ref={(instance)=>{
                                                                provideRef(instance,client._id)
                                                        }}

                                                ></audio>
                                                <h4>{client?.name}</h4>
                                        </div>
                                )})
                       }
                </div>
        )
}

export default Room