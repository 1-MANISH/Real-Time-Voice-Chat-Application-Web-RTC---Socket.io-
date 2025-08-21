import React from 'react'
import styles from './StepOtp.module.css'
function StepOtp({
        onClickNext = () => {},
}) {
        return (
                <div>
                         <button onClick={onClickNext && onClickNext}>
                                Next Step (OTP)
                        </button>
                </div>
        )
}

export default StepOtp