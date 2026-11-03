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
        const [passcode, setPasscode] = useState(() => Math.floor(1000 + Math.random() * 9000).toString())


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

                        const payload = {
                                roomTopic:roomTopicMain,
                                roomType:roomTypeSelected,
                                ...(roomTypeSelected === 'closed' ? { passcode: passcode.trim() } : {})
                        }

                        // server call
                        const {data} = await createRoom(payload)
                        if(data?.success){
                                toggleModal()
                                setRoomTopic("")
                                setRoomTypeSelected("open")
                                navigate(`/room/${data?.room?._id}`)
                        }
                        
                } catch (error) {
                        console.log(error)
                }
                
        },[roomTopic,roomTypeSelected,passcode,navigate,toggleModal])

        const footerTextMap = {
                open: "Start a room, open to everyone",
                social: "Start a room for your community and friends",
                closed: `Private room with passcode (${passcode})`
        }

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

                                        {roomTypeSelected === 'closed' && (
                                                <div className={styles.passcodeWrapper}>
                                                        <span className={styles.passcodeLabel}>Set 4-Digit Passcode</span>
                                                        <input 
                                                                type="text"
                                                                maxLength={6}
                                                                value={passcode}
                                                                onChange={(e) => setPasscode(e.target.value)}
                                                                className={styles.passcodeInput}
                                                                placeholder="Passcode"
                                                        />
                                                </div>
                                        )}
                                </div>
                                <div className={styles.modalFooter}>
                                       <hr className={styles.divider} />         
                                       <p className={styles.modalFooterText}>{footerTextMap[roomTypeSelected]}</p>

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