import React, { lazy, useState,useCallback } from 'react'
import styles from './StepName.module.css'
import {useDispatch, useSelector} from 'react-redux'
import { setName as setUserName } from '../../../redux/slices/activationSlice'
const Card = lazy(()=>import( '../../../components/shared/Card/Card'))
const Button = lazy(()=>import( '../../../components/shared/Button/Button'))
const TextInput = lazy(()=>import( '../../../components/shared/TextInput/TextInput'))

function StepName({
        onClickNext = () => {},

}) {

        const dispatch = useDispatch()

        const {name:userName}  = useSelector((store)=>store.activation)
        const[name,setName] = useState(userName)

        const submitHandler = useCallback(async ()=>{
                try {
                       if(!name){
                               return
                       }
                        dispatch(setUserName(name))

                        if(onClickNext){
                                onClickNext()
                        }
                               
                } catch (error) {
                        console.log(error)
                }
        },[name])

        return (
                 <div  className={`${styles.stepNameContainer} container`}>
                        <Card 
                                headingText="What is your full name ?"
                                imageSrc="/images/emojiman.png"
                         >
                         
                                <div className={styles.inputWrapper}>
                                        <TextInput
                                                placeholder="Your name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
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
                                                People use real names at voicers 
                                        </span>
                                </div>
                        </Card>
                 </div>
        )
}

export default StepName