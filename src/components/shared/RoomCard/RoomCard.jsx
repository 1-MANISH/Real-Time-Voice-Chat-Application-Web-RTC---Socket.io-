import React, { useMemo } from 'react'
import styles from './RoomCard.module.css'
import { useNavigate } from 'react-router'




function RoomCard({
        room,
        rIndex,
        onJoinRoom
}) {

        const navigate = useNavigate()

        const colors = useMemo(()=>{
                return [
                        ["#0077FF","#20BD5F"],
                        ["#5453E0","#E91E63"],
                        ["#FF6B00","#E91E63"],
                        ["#20BD5F","#5453E0"],
                ]
        },[])

        const handleClick = () => {
                if (onJoinRoom) {
                        onJoinRoom(room)
                } else {
                        navigate(`/room/${room?._id}`)
                }
        }

        const roomType = room?.roomType || 'open'
        const badgeConfig = {
                open: { label: 'Open', icon: '/images/globe-type.png', className: styles.openBadge },
                social: { label: 'Social', icon: '/images/user-type.png', className: styles.socialBadge },
                closed: { label: 'Closed', icon: '/images/lock-type.png', className: styles.closedBadge },
        }
        const badge = badgeConfig[roomType] || badgeConfig.open

        return (
                <div className={styles.roomCard} onClick={handleClick}>
                        <div className={styles.cardHeaderRow}>
                                <h3 className={styles.roomCardHeading}>{room?.roomTopic}</h3>
                                <span className={`${styles.typeBadge} ${badge.className}`}>
                                        <img src={badge.icon} alt={badge.label} className={styles.typeIcon} />
                                        <span>{badge.label}</span>
                                </span>
                        </div>

                        <div className={styles.roomSpeakers}>
                                <div className={styles.roomSpeakerAvatars}>
                                        {
                                                room?.speakers?.map((speaker,index) => (
                                                        <img 
                                                                key={speaker?.avatar+"----"+speaker?._id} 
                                                                src={speaker?.avatar} 
                                                                alt="speaker avatar"
                                                                className={styles.roomSpeakerAvatarsImage}
                                                                style={{
                                                                        border: `2px solid ${colors[rIndex%4][index]}`,
                                                                }}
                                                         />
                                                ))
                                        }
                                </div>
                                <div className={styles.roomSpeakerNames}>
                                         {
                                                room?.speakers?.map((speaker) => (
                                                        <p 
                                                                key={speaker?.name+speaker?._id} 
                                                                className={styles.roomSpeakerNamesText}
                                                        >
                                                               <span> {speaker?.name} </span>
                                                                 <img
                                                                        src='/images/messageicon.png'
                                                                        alt='arrow icon'
                                                                />
                                                        </p>
                                                       
                                                ))
                                        }
                                </div>
                        </div>

                        <div className={styles.roomCardFooter}>
                               <div className={styles.roomCardFooterContent}>
                                <span className={styles.roomCardFooterContentText}>{room?.totalPeople}</span>
                                <img 
                                        src='/images/people.png' 
                                        alt='people icon'
                                        className={styles.roomCardFooterContentImage}
                                />
                                </div>                 
                        </div>
                </div>
        )
}

export default RoomCard