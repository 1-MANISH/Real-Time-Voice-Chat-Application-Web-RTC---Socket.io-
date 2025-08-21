import React from 'react'
import styles from './StepPhoneEmail.module.css'
function StepPhoneEmail({
        onClickNext = () => {},
}) {
        return (
                <div>
                        <button onClick={onClickNext && onClickNext}>
                                Next Step (Phone/Email)
                        </button>
                </div>
        )
}

export default StepPhoneEmail