import React from 'react'
import styles from './Card.module.css'

function Card({
        imageSrc,
        headingText,
        children,
}) {
        return (
                    <div className={`${styles.card}`}>
                                <div className={`${styles.headingWrapper}`}>
                                        <img src={imageSrc} alt='' className={`${styles.headingWrapperImage}`} />
                                        <h1 className={`${styles.headingWrapperText}`}>{headingText} </h1>
                                </div>
                                
                                {children}
                                
                 </div>
        )
}

export default Card