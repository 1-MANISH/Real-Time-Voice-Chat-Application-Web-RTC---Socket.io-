import React from 'react'
import styles from './StepUsername.module.css'
function StepUsername({
                onClickNext = () => {},
}) {
        return (
                <div>
                         <button onClick={onClickNext && onClickNext}>
                                Next Step (Username)
                        </button>
                </div>
        )
}

export default StepUsername