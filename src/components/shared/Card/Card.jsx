import React from 'react'
import styles from './Card.module.css'

function Card({
        imageSrc,
        headingText,
        children,
        width = '500px',
}) {
        return (
                    <div style={{width}} className={`${styles.card}`}>
                                <div className={`${styles.headingWrapper}`}>
                                       {imageSrc && <img src={imageSrc} alt='image icon' className={`${styles.headingWrapperImage}`} />}
                                        <h1 className={`${styles.headingWrapperText}`}>{headingText} </h1>
                                </div>
                                
                                {children}
                                
                 </div>
        )
}

export default Card