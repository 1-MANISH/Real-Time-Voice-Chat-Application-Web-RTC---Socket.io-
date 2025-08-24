import React from 'react'
import styles from './TextInput.module.css'
function TextInput(props) {
        return (
                <div>

                        <input
                                className={`${styles.textInput}`} 
                                type='text' 
                                {...props}
                        >

                        </input>
                </div>
        )
}

export default TextInput