import React from 'react'
import styles from './TextInput.module.css'
function TextInput(props) {
        return (
                <div>

                        <input
                                className={`${styles.textInput}`} 
                                type='text' 
                                {...props}
                                style={{width:props?.width}}
                        >

                        </input>
                </div>
        )
}

export default TextInput