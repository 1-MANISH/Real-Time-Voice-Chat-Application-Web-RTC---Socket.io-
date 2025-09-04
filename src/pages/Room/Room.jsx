import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './Room.module.css'
import { useNavigate, useParams } from 'react-router'
import { useWebRTC } from '../../hooks/useWebRTC'
import { useSelector } from 'react-redux'
import { getRoom } from '../../axios'
function Room() {

        const navigate = useNavigate()
        
        const {roomId} = useParams()
        const {user} = useSelector((store)=>store.auth)
        const [room,setRoom] = useState(null)

        const {clients,provideRef} = useWebRTC(roomId,user)

        const goBackToRoom = useCallback(()=>{
                navigate("/rooms")
        },[navigate])

        const colors = useMemo(()=>{
                return [ "#0077FF","#20BD5F","#5453E0", "#FF6B00","#E91E63",]
        },[])

        useEffect(()=>{
                const fetchRoom = async() =>{
                        try {
                               const {data} = await getRoom(roomId)

                               console.log(data);
                               
                               setRoom(prev=>{
                                       return data.room
                               })
                        } catch (error) {
                                console.log(error);
                                
                        }       
                }
                fetchRoom()
        },[roomId])


        return (
                <div >
                        <div className='container'>
                                <button className={styles.goBackButton} onClick={goBackToRoom}>
                                        <img src="/images/goback-arror.png" alt="go back arrow" />
                                        <span className={styles.goBackButtonText}>All voice rooms</span>
                                </button>
                        </div>
                              
                        <div className={styles.clientsWrapper}>

                                <div className={styles.header}>
                                        <h3 className={styles.roomTopic}>{room?.roomTopic}</h3>

                                        <div className={styles.actionButtons}>
                                                <button className={styles.handRaise}>
                                                        <img src="/images/hand-raise.png" alt="hand raise" />
                                                </button>
                                                <button className={styles.leaveRoom} onClick={goBackToRoom}>
                                                        <img src="/images/leave-room.png" alt="hand raise" />
                                                        <span>Leave quietly</span>
                                                </button>
                                        </div>
                                </div>

                                <div className={styles.clientsList}>
                                {
                                    clients && clients.map((client,index)=>{
                                        return (
                                        <div  
                                                key={client?._id+"client"} 
                                                className={styles.client}
                                                style={{
                                                        border: `4px solid ${colors[index%colors.length]}`
                                                }}
                                        >
                                                        <div className={styles.userHead}>
                                                                <label htmlFor="mic" className={styles.mic}>
                                                                        <img className={styles.micOffImage} src="/images/mic_off.png" alt="mic off" />
                                                                </label>
                                                                <audio 
                                                                        id='mic'
                                                                        controls
                                                                        autoPlay
                                                                        ref={(instance)=>{
                                                                                                provideRef(instance,client._id)
                                                                        }}
                                                                        className={styles.userAudio}
                                                                        

                                                                ></audio>
                                                                <img src={client?.avatar} alt="user avatar" className={styles.userAvatar} />
                                                        </div>
                                                        <h4 className={styles.clientName}>{client?.name}</h4>
                                                </div>
                                        )})            
                                }
                                </div>
                       </div>
                </div>
        )
}

export default Room