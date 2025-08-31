import React, { lazy, useCallback, useState } from 'react'
import styles from './AddRoomModal.module.css'
import { createRoom } from '../../../axios'
import {useNavigate} from "react-router"
const TextInput  = lazy(()=>import( '../../shared/TextInput/TextInput'))
const RoomType  = lazy(()=>import( '../../shared/RoomType/RoomType'))

const roomTypes = [
        {
                title:"Open",
                imgSrc:"images/globe-type.png",
                value:"open"
        },
        {
                title:"Social",
                imgSrc:"images/user-type.png",
                value:"social"
        },
        {
                title:"Closed",
                imgSrc:"images/lock-type.png",
               value:"closed"
        }
]

function AddRoomModal({
        toggleModal=()=>{},
}) {

        const navigate = useNavigate()

        const [ roomTopic,setRoomTopic] = useState("")
        const [roomTypeSelected,setRoomTypeSelected] = useState("open")


        const outsideClicked = (e) => {
                if(e.target.classList.contains(styles.modalMask)){
                        toggleModal()
                }
        }

        const setRoomTypeSelectedHandler = useCallback((type)=>{
                setRoomTypeSelected(type)
        },[])

        const createRoomHandler = useCallback(async (e)=>{
                e.preventDefault()

                try {
                        let roomTopicMain = roomTopic.trim()
                        if(!roomTopicMain.trim() || !roomTypeSelected) return

                        // server call
                        const {data} = await createRoom({
                                roomTopic:roomTopicMain,
                                roomType:roomTypeSelected
                        })
                        if(data?.success){
                                toggleModal()
                                setRoomTopic("")
                                setRoomTypeSelected("open")
                                navigate(`/room/${data?.room?._id}`)
                        }
                        
                } catch (error) {
                        console.log(error)
                }
                
        },[roomTopic,roomTypeSelected])


        return (
                <div className={styles.modalMask} onClick={outsideClicked}>
                       
                        <div className={styles.modalBody}>
                                <div className={styles.modalHeader}>
                                        <h3 className={styles.modalHeading}>Enter the topic to be discussed</h3>
                                        <TextInput     
                                                placeholder="Enter the topic"
                                                width="94%"  
                                                value={roomTopic}  
                                                onChange={(e) => setRoomTopic(e.target.value)}
                                                style={{color:`var(--secondary-text-color)`}}
                                        />
                                        <h4 className={styles.modalMainHeading}>Room type</h4>
                                        <div className={styles.roomTypeContainer}>
                                                {
                                                        roomTypes.map((roomType,index) => (
                                                        <RoomType 
                                                                key={index} 
                                                                roomType={roomType}
                                                                onClicker={setRoomTypeSelectedHandler}
                                                                active={roomTypeSelected===roomType.value}
                                                        />
                                                        ))
                                                }
                                        </div>
                                </div>
                                <div className={styles.modalFooter}>
                                       <hr className={styles.divider} />         
                                       <p className={styles.modalFooterText}>Start a room, open to everyone</p>

                                         <button className={styles.letsGoBtn} onClick={createRoomHandler} >
                                                <img
                                                       src='/images/celebration.png'
                                                       className={styles.letsGoBtnImage}
                                                       alt='go room icon'
                                               />
                                                <span>Lets Go</span>
                                        </button>
                                </div>
                                 <div className={styles.modalMaskClose}>
                                        <img src='/images/close.png' alt='close icon' onClick={ toggleModal} />
                                 </div>
                        </div>
                </div>
        )
}

export default AddRoomModal