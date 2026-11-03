import React, { lazy, useCallback, useEffect, useMemo, useState } from 'react'
import styles from "./Rooms.module.css"
import { getAllRooms } from '../../axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const AddRoomModal = lazy(()=>import('../../components/modals/AddRoomModal/AddRoomModal'))
const RoomCard = lazy(()=>import('../../components/shared/RoomCard/RoomCard'))
const EnterPasscodeModal = lazy(()=>import('../../components/modals/EnterPasscodeModal/EnterPasscodeModal'))

function Rooms() {
        const navigate = useNavigate()
        const { user } = useSelector((store) => store.auth)

        const [showModal,setShowModal] = useState(false)
        const [rooms,setRooms] = useState([])
        const [activeFilter, setActiveFilter] = useState('all')
        const [searchTerm, setSearchTerm] = useState('')
        const [selectedLockedRoom, setSelectedLockedRoom] = useState(null)

        const toggleModal = useCallback(()=>{
                setShowModal(prev=>!prev)
        },[])

        const fetchRooms = useCallback(async () => {
                try {
                        const {data} = await getAllRooms()
                        if(data?.success)
                                setRooms(data?.rooms)
                } catch (error) {
                        console.log(error)
                }
        }, [])

        useEffect(()=>{
                fetchRooms()
        },[fetchRooms])

        const handleJoinRoom = useCallback((room) => {
                const isOwner = room.ownerId && (
                        (room.ownerId._id && room.ownerId._id === user?._id) ||
                        room.ownerId === user?._id
                )
                if (room.roomType === 'closed' && !isOwner) {
                        setSelectedLockedRoom(room)
                } else {
                        navigate(`/room/${room._id}`)
                }
        }, [user, navigate])

        const filteredRooms = useMemo(() => {
                return rooms.filter((room) => {
                        // Type filter
                        if (activeFilter !== 'all' && room.roomType !== activeFilter) {
                                return false
                        }
                        // Search filter
                        if (searchTerm.trim()) {
                                const term = searchTerm.toLowerCase().trim()
                                const topicMatches = room.roomTopic?.toLowerCase().includes(term)
                                const speakerMatches = room.speakers?.some((s) => s?.name?.toLowerCase().includes(term))
                                return topicMatches || speakerMatches
                        }
                        return true
                })
        }, [rooms, activeFilter, searchTerm])

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
                                                        alt='search'
                                                />
                                                <input 
                                                        type='text'
                                                        placeholder='Search rooms'
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
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

                        {/* Room Type Tabs */}
                        <div className={styles.filterTabs}>
                                <button
                                        className={`${styles.tabBtn} ${activeFilter === 'all' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveFilter('all')}
                                >
                                        <span>All Rooms</span>
                                </button>
                                <button
                                        className={`${styles.tabBtn} ${activeFilter === 'open' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveFilter('open')}
                                >
                                        <span>🌐 Open</span>
                                </button>
                                <button
                                        className={`${styles.tabBtn} ${activeFilter === 'social' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveFilter('social')}
                                >
                                        <span>👥 Social</span>
                                </button>
                                <button
                                        className={`${styles.tabBtn} ${activeFilter === 'closed' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveFilter('closed')}
                                >
                                        <span>🔒 Closed</span>
                                </button>
                        </div>

                        <div className={styles.roomsList}>
                                {
                                        filteredRooms.length > 0 ? (
                                                filteredRooms.map((room,index)=>(
                                                        <RoomCard 
                                                                key={room._id} 
                                                                room={room}
                                                                rIndex={index}
                                                                onJoinRoom={handleJoinRoom}
                                                        />
                                                ))
                                        ) : (
                                                <div className={styles.emptyState}>
                                                        <p>No voice rooms found.</p>
                                                </div>
                                        )
                                }
                        </div>
                </div>
                {
                       showModal &&
                        <AddRoomModal 
                                toggleModal={toggleModal}
                       />
                }
                {
                        selectedLockedRoom &&
                        <EnterPasscodeModal
                                room={selectedLockedRoom}
                                onClose={() => setSelectedLockedRoom(null)}
                        />
                }
                </>
        )
}

export default Rooms

