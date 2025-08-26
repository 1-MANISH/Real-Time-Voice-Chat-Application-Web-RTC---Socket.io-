import React, { lazy, useCallback, useState } from 'react'
import styles from './Phone.module.css'
import { sendOtp } from '../../../../axios'
import { useDispatch } from 'react-redux'
import { setOtp } from '../../../../redux/slices/authSlice'
const Card = lazy(()=>import( '../../../../components/shared/Card/Card'))
const Button = lazy(()=>import( '../../../../components/shared/Button/Button'))
const TextInput = lazy(()=>import( '../../../../components/shared/TextInput/TextInput'))

function Phone({
        onClickNext = () => {},
}) {

        const dispatch = useDispatch()

        const [phoneNumber, setPhoneNumber] = useState("")

        const submitHandler = useCallback(async ()=>{

                try {
                        if(!phoneNumber)
                                return
                        
                        // server request
                        const {data}  = await sendOtp({
                                phone:phoneNumber
                        })

                        dispatch(setOtp(data))

                        if(onClickNext && data?.success )
                                onClickNext()
                } catch (error) {
                        console.log(error)
                }
        },[phoneNumber])

        return (
                <div className={`${styles.phoneContainer}`}>
                        <Card 
                                headingText="Enter your phone number"
                                imageSrc="/images/telephone.png"
                        >

                               <div className={styles.inputWrapper}>
                                        <TextInput
                                                placeholder="+91 12345 67890"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                        />

                               </div>
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
                                                By entering your number, you're agreeing to our Terms of Service and Privacy Policy. Thanks!
                                        </span>
                                </div>


                        </Card>
                </div>
        )
}

export default Phone