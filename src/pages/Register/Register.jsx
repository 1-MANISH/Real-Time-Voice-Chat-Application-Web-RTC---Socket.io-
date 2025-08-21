import React, { lazy, useCallback, useMemo, useState } from 'react'
import styles from './Register.module.css'

const StepPhoneEmail = lazy(() => import('../Steps/StepPhoneEmail/StepPhoneEmail'))
const StepOtp = lazy(() => import('../Steps/StepOtp/StepOtp'))
const StepName = lazy(() => import('../Steps/StepName/StepName'))
const StepAvatar = lazy(() => import('../Steps/StepAvatar/StepAvatar'))
const StepUsername = lazy(() => import('../Steps/StepUsername/StepUsername'))

const steps = {
        1:StepPhoneEmail,
        2:StepOtp,
        3:StepName,
        4:StepAvatar,
        5:StepUsername
}
function Register() {

        const [step,setStep] =  useState(1)

        const StepComponent = useMemo(()=>{
                return steps[step]
        },[step])

        const nextStepHandler = useCallback(()=>{
                setStep((prevStep) => {
                        if (prevStep < Object.keys(steps).length) {
                                return prevStep + 1
                        }
                        return prevStep
                })
        },[ steps ])

        

        return (
                 <div  className={`${styles.registerWrapper} container`}>
                        
                        <StepComponent
                                onClickNext={nextStepHandler}
                        />
                 </div>
        )
}

export default Register