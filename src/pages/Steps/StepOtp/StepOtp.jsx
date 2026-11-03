import React, { lazy, useState, useCallback } from 'react'
import styles from './StepOtp.module.css'
import TextInput from '../../../components/shared/TextInput/TextInput'
import { verifyOtp } from '../../../axios'
import {useDispatch,useSelector} from 'react-redux'
import { setAuth } from '../../../redux/slices/authSlice'
const Card = lazy(()=>import( '../../../components/shared/Card/Card'))
const Button = lazy(()=>import( '../../../components/shared/Button/Button'))

function StepOtp({
        onClickNext = () => {},
}) {

        const dispatch = useDispatch()

        const [otp,setOtp]  = useState("")
        const [error, setError] = useState("")

        const {otp:otpData} = useSelector((store)=>store.auth)

        const submitHandler = useCallback(async ()=>{
                setError("")
                try {
                        if(!otp || (!otpData.phone && !otpData.email) || !otpData.hash)
                                return

                        const payload = {
                                otp,
                                hash: otpData.hash,
                                ...(otpData.phone ? { phone: otpData.phone } : {}),
                                ...(otpData.email ? { email: otpData.email } : {})
                        }

                        const {data}  = await verifyOtp(payload)
                        if (data?.success) {
                                dispatch(setAuth(data))
                                if(onClickNext)
                                        onClickNext()
                        } else {
                                setError(data?.message || "Invalid OTP")
                        }
                } catch (err) {
                        console.log(err)
                        setError(err?.response?.data?.message || "Verification failed")
                }
        },[otp, otpData, dispatch, onClickNext])

        return (
                <div className={`${styles.stepOtpContainer} container`}>
                      <Card 
                                headingText="Enter the code we just sent you"
                                imageSrc="/images/lock.png"
                        >

                               <div className={styles.otpInputWrapper}>

                                         <TextInput 
                                                value={otp}
                                                onChange={(e)=>setOtp(e.target.value)}
                                                style={{width:"200px",textAlign:"center"}}
                                                placeholder="Enter OTP"
                                        />
                               </div>

                               {error && <p style={{color: 'var(--danger-color)', fontSize: '14px', marginTop: '10px'}}>{error}</p>}

                                 <div className={`${styles.infoTextWrapper}`}>
                                         <span>
                                               Did'nt receive? Tap to resend
                                        </span>
                                </div>

                                 <div>
                                        <Button
                                                text="Next"
                                                iconSrc="images/arrow_forward.png"
                                                width='150px'
                                                onClick={submitHandler}
                                        />
                                </div>
                        </Card>
                </div>
        )
}

export default StepOtp