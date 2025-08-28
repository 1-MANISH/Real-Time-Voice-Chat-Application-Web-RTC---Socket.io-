import React, { useCallback } from 'react'
import styles from './RoomType.module.css'
function RoomType({
        roomType,
        active,
        onClicker
}) {

        const onClickHandler = useCallback(()=>{
                if(onClicker)
                        onClicker(roomType.value)
        },[roomType])

        return (
                <div 
                        className={`${styles.roomTypeContainer} ${active && styles.active}`} 
                        onClick={onClickHandler}
                >
                        <img
                                src={roomType.imgSrc}
                                alt={roomType.title}
                                className={styles.roomTypeImage}
                                
                        />
                        <p className={styles.roomTypeTitle}>{roomType.title}</p>
                </div>
        )
}

export default RoomType