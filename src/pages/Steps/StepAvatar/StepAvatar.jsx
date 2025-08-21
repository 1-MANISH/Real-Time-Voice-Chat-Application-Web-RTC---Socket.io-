import React from 'react'
import styles from './StepAvatar.module.css'

function StepAvatar({
                onClickNext = () => {},

}) {
        return (
                <div>
                         <button onClick={onClickNext && onClickNext}>
                                Next Step (Avatar)
                        </button>
                </div>
        )
}

export default StepAvatar