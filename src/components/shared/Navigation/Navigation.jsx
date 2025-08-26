import React, { useCallback } from 'react'
import styles from './Navigation.module.css'
import { NavLink ,Link } from 'react-router'
import { logoutUser } from '../../../axios'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthLogout } from '../../../redux/slices/authSlice'

function Navigation() {

        const {isAuth,user} = useSelector((store)=>store.auth)

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
                marginLeft:"-13px"
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
             <>
                <nav className={`${styles.navbar} container `}>
                        <Link style={brandStyle}  to="/">
                                <img style={brandImageStyle} src="/images/voicer.png" alt="logo image" />
                                <span>Voicer</span>
                        </Link>
                        {
                                  isAuth && (
                                <div className={styles.rightBar}>
                                                <h3 className={styles.username}>{user?.name}</h3>
                                        <NavLink to={"/profile"} >
                                                        <img 
                                                                src={user?.avatar}
                                                                alt="profile image"
                                                                className={styles.profileImage}
                                                        />
                                        </NavLink>
                
                                                <button className={styles.logoutButton} onClick={logoutHandler}>
                                                                <img    
                                                                        src='images/arrow_forward.png'
                                                                        alt="logout icon"
                                                                        className={styles.logoutIcon}
                                                                />
                                                </button>
                                
                                </div>
                            )
                        }
                </nav>
                {
                        isAuth && (
                                <hr className={styles.hr} />
                        )
                }
             </>
        )
}

export default Navigation

