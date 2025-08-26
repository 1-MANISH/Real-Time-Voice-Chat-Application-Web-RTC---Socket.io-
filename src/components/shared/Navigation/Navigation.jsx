import React, { useCallback } from 'react'
import styles from './Navigation.module.css'
import { NavLink ,Link } from 'react-router'
import { logoutUser } from '../../../axios'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthLogout } from '../../../redux/slices/authSlice'

function Navigation() {

        const {isAuth} = useSelector((store)=>store.auth)

        const dispatch = useDispatch()

        const brandStyle = {
                color:'#fff',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                fontSize: '22px',
        }

        const brandImageStyle = {
                width: '100px',
        }

        const logoutHandler = useCallback(async()=>{
                try {
                        await logoutUser()
                        dispatch(setAuthLogout())
                        
                } catch (error) {
                        console.log(error);
                }
        },[])


        return (
                <nav className={`${styles.navbar} container `}>
                        <Link style={brandStyle}  to="/">
                                <img style={brandImageStyle} src="/images/voicer.png" alt="logo image" />
                                <span>Voicer</span>
                        </Link>

                       <div className={styles.rightBar}>
                        {
                                isAuth &&(
                                         <button onClick={logoutHandler}>
                                                Logout
                                        </button>
                                )
                        }
                               
                       </div>
                </nav>
        )
}

export default Navigation