import React, { lazy, useCallback } from 'react'
import styles from './Home.module.css'
import { Link, useNavigate } from 'react-router'

const Card = lazy(() => import('../../components/shared/Card/Card.jsx'))
const Button = lazy(() => import('../../components/shared/Button/Button.jsx'))
function Home() {

        const navigate = useNavigate();

        const signinLinkStyle = {
                textDecoration: 'none',
                color: '#0077FF',
                fontWeight: 'bold',
                fontSize: '16px',
        }


        const startRegistration = useCallback((e)=>{
                e.preventDefault()
                navigate('/register')
        },[ navigate ])


        return (
                <div className={`${styles.cardWrapper} container`}>

                        <Card 
                                imageSrc={'images/voicer.png'}
                                headingText={'Welcome to voicers !'}
                        >
                                 <p className={`${styles.paragraphText}`}>
                                        We’re working hard to get Codershouse ready for everyone! While we wrap up the finishing youches, we’re adding people gradually to make sure nothing breaks 
                                </p>
                                
                                 <div>
                                        <Button
                                                text="Get your username"
                                                iconSrc="images/arrow_forward.png"
                                                onClick={startRegistration}
                                        />
                                </div>

                                <div className={`${styles.signinWrapper}`}>
                                        <span className={`${styles.inviteText}`}>Have an invite text?</span>
                                        <Link to="/login" style={signinLinkStyle}>
                                                <span>Sign in</span>
                                        </Link>
                                </div>

                        </Card>

                      
                </div>
        )
}

export default Home