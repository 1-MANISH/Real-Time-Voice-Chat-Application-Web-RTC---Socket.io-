import React, { lazy, useCallback, useMemo, useState } from 'react'
import styles from './StepPhoneEmail.module.css'


const Phone = lazy(() => import('./Phone/Phone.jsx'))
const Email = lazy(() => import('./Email/Email.jsx'))

const phoneEmailMap = {
        phone:Phone,
        email: Email,
}

function StepPhoneEmail({
        onClickNext = () => {},
}) {

        const [type,setType ] = useState('phone')
        const ToggleComponent = useMemo(()=>{
                return phoneEmailMap[type]
        },[type])

        const toggleHandler = useCallback((type)=>{
                setType(type)
        },[])

        
        return (
                <div className={`${styles.stepPhoneEmailContainer} container`}>

                        <div className={styles.toggleButtonContainer}>
                                <button onClick={()=> toggleHandler('phone')} className={`${type === 'phone' ? styles.active : ''} ${styles.toggleButton} `}>
                                        <img src="/images/phone_android.png" alt="phone icon" className={styles.toggleButtonImage} />
                                </button >
                                <button onClick={()=> toggleHandler('email')} className={`${type === 'email' ? styles.active : ''} ${styles.toggleButton} `} >
                                        <img src="/images/email.png" alt="email icon"  className={styles.toggleButtonImage}  />
                                </button>
                        </div>


                       <ToggleComponent onClickNext={onClickNext} />
                      
                </div>
        )
}

export default StepPhoneEmail