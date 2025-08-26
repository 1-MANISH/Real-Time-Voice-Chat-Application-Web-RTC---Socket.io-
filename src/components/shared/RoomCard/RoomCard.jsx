import React from 'react'
import styles from './RoomCard.module.css'


function RoomCard({
        room
}) {
        return (
                <div className={styles.roomCard}>
                        <h3 className={styles.roomCardHeading}>{room?.topic}</h3>

                        <div className={styles.roomSpeakers}>
                                <div className={styles.roomSpeakerAvatars}>
                                        {
                                                room?.speakers?.map((speaker) => (
                                                        <img 
                                                                key={speaker?.avatar+"----"+speaker?.id} 
                                                                src={speaker?.avatar} 
                                                                alt="speaker avatar"
                                                                className={styles.roomSpeakerAvatarsImage}
                                                         />
                                                ))
                                        }
                                </div>
                                <div className={styles.roomSpeakerNames}>
                                         {
                                                room?.speakers?.map((speaker) => (
                                                        <p 
                                                                key={speaker?.name+speaker?.id} 
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