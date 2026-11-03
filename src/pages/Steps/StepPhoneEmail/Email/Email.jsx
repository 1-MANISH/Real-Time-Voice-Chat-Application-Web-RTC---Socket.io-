import React, { lazy, useCallback, useState } from 'react'
import styles from './Email.module.css'
import { sendOtp } from '../../../../axios'
import { useDispatch } from 'react-redux'
import { setOtp } from '../../../../redux/slices/authSlice'

const Card = lazy(()=>import( '../../../../components/shared/Card/Card'))
const Button = lazy(()=>import( '../../../../components/shared/Button/Button'))
const TextInput = lazy(()=>import( '../../../../components/shared/TextInput/TextInput'))

function Email({
          onClickNext = () => {},
}) {

        const dispatch = useDispatch()
        const [email, setEmail] = useState("")
        const [error, setError] = useState("")

        const submitHandler = useCallback(async () => {
                setError("")
                try {
                        if(!email || !email.includes('@')) {
                                setError("Please enter a valid email address")
                                return
                        }

                        const {data} = await sendOtp({
                                email
                        })

                        if(data?.success) {
                                dispatch(setOtp(data))
                                if(onClickNext) onClickNext()
                        } else {
                                setError(data?.message || "Failed to send OTP")
                        }
                } catch (err) {
                        console.log(err)
                        setError(err?.response?.data?.message || "Error sending OTP")
                }
        }, [email, dispatch, onClickNext])

        return (
               <div className={`${styles.emailContainer}`}>
                        <Card
                                headingText="Enter your email address"
                                imageSrc="/images/mail.png"
                        >
                                  <div className={styles.inputWrapper}>
                                                <TextInput
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                />
                                
                                </div>

                                {error && <p style={{color: 'var(--danger-color)', fontSize: '14px', marginTop: '10px'}}>{error}</p>}

                                  <div>
                                        <Button
                                                text="Next"
                                                iconSrc="images/arrow_forward.png"
                                                width='150px'
                                                onClick={submitHandler}
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