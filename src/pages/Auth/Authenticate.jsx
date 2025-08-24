import React, { lazy, useCallback, useMemo, useState } from 'react'


const StepPhoneEmail = lazy(() => import('../Steps/StepPhoneEmail/StepPhoneEmail'))
const StepOtp = lazy(() => import('../Steps/StepOtp/StepOtp'))

const steps = {
        1:StepPhoneEmail,
        2:StepOtp,
}

function Authenticate() {

        const [step,setStep] =  useState(1)
                
        const StepComponent = useMemo(()=>{
                        return steps[step]
        },[step])
                
        const nextStepHandler = useCallback(()=>{
                        setStep((prevStep) => {
                                if (prevStep <= Object.keys(steps).length) {
                                        return prevStep + 1
                                }
                                return prevStep
                        })
        },[ steps ])
        
        return (
                <StepComponent
                        onClickNext={nextStepHandler}
                />
        )
}

export default Authenticate