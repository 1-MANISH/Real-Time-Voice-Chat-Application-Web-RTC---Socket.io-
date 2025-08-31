import React, { lazy, useCallback, useEffect, useState } from 'react'
import styles from "./Rooms.module.css"
import { getAllRooms } from '../../axios'

const AddRoomModal  =lazy(()=>import( '../../components/modals/AddRoomModal/AddRoomModal'))
const RoomCard  = lazy(()=>import( '../../components/shared/RoomCard/RoomCard'))

// const rooms = [
//         {
//                 _id:1,
//                 topic:'Which framework best for frontend ?',
//                 speakers:[
//                         {
//                                 _id:1,
//                                 name:'Rahul',
//                                 avatar:'images/emojiavatar.png'
//                         },{
//                                 _id:2,
//                                 name:'Vijay',
//                                 avatar:'images/emojiavatar.png'
//                         }
//                 ],
//                 totalPeople:40
//         },{
//                 _id:2,
//                 topic:'Redux Vs RTK or Combined Redux + RTK ?',
//                 speakers:[
//                         {
//                                 _id:11,
//                                 name:'Prakasur',
//                                  avatar:'images/emojiavatar.png'
//                         },{
//                                 _id:22,
//                                 name:'Rancho',
//                                  avatar:'images/emojiavatar.png'
//                         }
//                 ],
//                 totalPeople:4
//         }
//         ,{
//                 _id:3,
//                 topic:'Whats new in AI and ML ?',
//                 speakers:[
//                         {
//                                 _id:111,
//                                 name:'Gogi',
//                                 avatar:'images/emojiavatar.png'
//                         },{
//                                 _id:222,
//                                 name:'Rohit',
//                                  avatar:'images/emojiavatar.png'
//                         }
//                 ],
//                 totalPeople:4
//         },{
//                 _id:4,
//                 topic:'Which framework best for backend ?',
//                 speakers:[
//                         {
//                                 _id:1111,
//                                 name:'Gogi',
//                                 avatar:'images/emojiavatar.png'
//                         },{
//                                 _id:2222,
//                                 name:'Rohit',
//                                  avatar:'images/emojiavatar.png'
//                         }
//                 ],
//                 totalPeople:4
//         }
// ]
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

