import React, { lazy, useCallback, useMemo, useState } from 'react'


const StepName = lazy(() => import('../Steps/StepName/StepName'))
const StepAvatar = lazy(() => import('../Steps/StepAvatar/StepAvatar'))

const steps = {
        1:StepName,
        2:StepAvatar,
}
function Activate() {

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
        },[ step ])
        
        return (
                 <StepComponent
                        onClickNext={nextStepHandler}
                />
        )
}

export default Activate