import React, { lazy, useCallback, useEffect, useState } from 'react'
import styles from "./Rooms.module.css"
import { getAllRooms } from '../../axios'

const AddRoomModal  =lazy(()=>import( '../../components/modals/AddRoomModal/AddRoomModal'))
const RoomCard  = lazy(()=>import( '../../components/shared/RoomCard/RoomCard'))


function Rooms() {

        const [showModal,setShowModal] = useState(false)

        const [rooms,setRooms]  = useState([])

        const toggleModal = useCallback(()=>{
                setShowModal(prev=>!prev)
        },[showModal])

        useEffect(()=>{
                const fetchRooms = async()=>{
                        try {
                                const {data} = await getAllRooms()
                                if(data?.success)
                                        setRooms(data?.rooms)
                        } catch (error) {
                                console.log(error)
                        }
                }
                fetchRooms()
        },[])


        return (
                <>
                <div className='container'>
                        <div className={styles.roomsHeader}>
                                <div className={styles.roomsHeaderWrapperLeft}>
                                        <span className={styles.heading}>All voice rooms</span>

                                        <div className={styles.searchBoxWrapper}>
                                                <img 
                                                        src='/images/search.png' 
                                                        className={styles.searchIcon}
                                                />
                                                <input 
                                                        type='text'
                                                        placeholder='Search rooms'
                                                        className={styles.inputBox}
                                                />
                                        </div>
                                </div>
                                <div className={styles.roomsHeaderWrapperRight}>
                                        <button className={styles.startRoomButton} onClick={toggleModal}>
                                                <img
                                                        src='/images/group.png'
                                                        className={styles.startRoomButtonImage}
                                                        alt='start room icon'
                                                />
                                                <span>Start a room</span>
                                        </button>
                                </div>
                        </div>

                        <div className={styles.roomsList}>
                               {
                                       rooms && rooms.map((room,index)=>(
                                        <RoomCard 
                                                key={room._id} 
                                               room={room}
                                               rIndex={index}
                                        />
                                       ))
                               }
                        </div>
                </div>
                {
                       showModal &&
                        <AddRoomModal 
                                toggleModal={toggleModal}

                       />
                }
                </>
        )
}

export default Rooms

