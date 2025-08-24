import React, { lazy, useState } from 'react'
import styles from './Email.module.css'

const Card = lazy(()=>import( '../../../../components/shared/Card/Card'))
const Button = lazy(()=>import( '../../../../components/shared/Button/Button'))
const TextInput = lazy(()=>import( '../../../../components/shared/TextInput/TextInput'))

function Email({
          onClickNext = () => {},
}) {

        const  [email, setEmail] = useState("")

        return (
               <div className={`${styles.emailContainer}`}>
                        <Card
                                headingText="Enter your email address"
                                imageSrc="/images/mail.png"
                        >
                                  <div className={styles.inputWrapper}>
                                                <TextInput
                                                        type="email"
                                                        placeholder="Enter your email "
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                />
                                
                                </div>

                                  <div>
                                        <Button
                                                text="Next"
                                                iconSrc="images/arrow_forward.png"
                                                width='150px'
                                                onClick={onClickNext && onClickNext}
                                        />
                                </div>

                                          <div className={`${styles.infoTextWrapper}`}>
                                                <span>
                                                        By entering your email, you're agreeing to our Terms of Service and Privacy Policy. Thanks!
                                                </span>
                                        </div>
                        </Card>
                </div>
        )
}

export default Email