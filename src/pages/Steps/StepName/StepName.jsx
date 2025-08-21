import React from 'react'
import styles from './StepName.module.css'
function StepName({
                onClickNext = () => {},

}) {
        return (
                 <div>
                         <button onClick={onClickNext && onClickNext}>
                                Next Step (Name)
                        </button>
                 </div>
        )
}

export default StepName