import React, { lazy } from 'react'
import styles from './Loader.module.css'
const Card = lazy(()=>import( '../../shared/Card/Card'))
function Loader({
        message="loading , please wait...",
        mt='8rem'
}) {
        return (
                <div className={`${styles.loadingContainer} container`} style={{marginTop:mt}}>
                        <Card 
                               
                         >
                                <div className={styles.loadingWrapper}>
                                        <div className={styles.loader}>

                                        </div>
                                        <span className={styles.message}>
                                                {message}
                                        </span>
                                </div>
                                
                         
                      
                        </Card>
                </div>
        )
}

export default Loader