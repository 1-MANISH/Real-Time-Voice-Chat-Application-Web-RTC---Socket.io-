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

        const {otp:otpData} = useSelector((store)=>store.auth)

        const submitHandler = useCallback(async ()=>{

                try {
                        // server request
                        if(!otp || !otpData.phone)
                                return

                        const {data}  = await verifyOtp({
                                otp,
                                phone:otpData.phone,
                                hash:otpData.hash
                        })
                        dispatch(setAuth(data))
                        
                        if(onClickNext && data?.success )
                                onClickNext()
                } catch (error) {
                        console.log(error)
                }
        },[otp])

        return (
                <div className={`${styles.stepOtpContainer} container`}>
                      <Card 
                                headingText="Enter the code we just texted you"
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