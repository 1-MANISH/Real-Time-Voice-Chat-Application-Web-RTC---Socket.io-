import React from 'react'
import styles from './Button.module.css'
function Button({
        text,
        iconSrc = '',
        width = '',
        onClick = ()=>{}
}) {
        return (
                <button style={{width}} onClick={onClick && onClick} className={`${styles.button}`}>
                        <span className={`${styles.buttonText}`}>{text}</span>
                        {iconSrc && <img src={iconSrc} alt="button icon" />}
                </button>
        )
}

export default Button