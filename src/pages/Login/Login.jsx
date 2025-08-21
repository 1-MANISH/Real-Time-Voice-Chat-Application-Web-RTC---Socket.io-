import React, { lazy, useCallback, useMemo, useState } from 'react'
import styles from './Login.module.css'


const StepPhoneEmail = lazy(() => import('../Steps/StepPhoneEmail/StepPhoneEmail'))
const StepOtp = lazy(() => import('../Steps/StepOtp/StepOtp'))

const steps = {
        1:StepPhoneEmail,
        2:StepOtp,
}
function Login() {

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
              <div  className={`container`}>
                                      
                        <StepComponent
                                onClickNext={nextStepHandler}
                        />
                 </div>
        )
}

export default Login