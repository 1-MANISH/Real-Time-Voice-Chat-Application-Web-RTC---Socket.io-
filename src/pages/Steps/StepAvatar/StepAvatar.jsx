import React, { lazy, useCallback, useState } from 'react'
import styles from './StepAvatar.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { setAvatar } from '../../../redux/slices/activationSlice'
import { activateUser } from '../../../axios'
import { setAuth } from '../../../redux/slices/authSlice'

const Card = lazy(()=>import( '../../../components/shared/Card/Card'))
const Button = lazy(()=>import( '../../../components/shared/Button/Button'))

function StepAvatar({
                onClickNext = () => {},

}) {

        const dispatch = useDispatch()

        const[avatarImage,setAvatarImage] = useState('images/avatarDemo.png')

        const {name,avatar}  = useSelector((store)=>store.activation)


        const captureImageHandler = useCallback(async(e)=>{
                const file = e.target.files[0]
                const reader = new FileReader()
                reader.readAsDataURL(file) //takes time
                reader.onloadend = async ()=>{
                         setAvatarImage(reader.result)
                        await dispatch(setAvatar(reader.result))
                }
        },[avatarImage])

         const submitHandler = useCallback(async ()=>{
                try {
                              
                        const {data}  = await activateUser({
                                name,
                                avatar
                        })
                        if(data?.success  && data.auth && data.user.activated){
                                dispatch(setAuth(data))
                        }
                        
                        // onClickNext()
                } catch (error) {
                        console.log(error.response.data.message)
                }
        },[avatar,name])



        return (
                  <div  className={`${styles.stepAvatarContainer} container`}>
                        <Card 
                                headingText={`Okay , ${name}`}
                                imageSrc="/images/emojiavatar.png"
                         >

                                 <div className={`${styles.infoTextWrapper}`}>
                                        <span>
                                                How this photo ?
                                        </span>
                                </div>
                         
                                <div className={styles.inputWrapper}>
                                        <img src={avatarImage} alt="avatar" className={styles.avatarImage} />
                         
                                </div>

                                <div className={styles.input}>
                                        <input 
                                                id='avatarFile'  
                                                type='file' 
                                                className={styles.avatarInput} 
                                                onChange={captureImageHandler}
                                        />
                                        <label htmlFor='avatarFile' className={styles.avatarLabel}>Choose a different photo</label>
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

export default StepAvatar