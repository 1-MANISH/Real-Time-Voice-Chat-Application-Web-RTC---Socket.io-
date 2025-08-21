import React from 'react'
import styles from './Navigation.module.css'
import { NavLink ,Link } from 'react-router'

function Navigation() {

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

        return (
                <nav className={`${styles.navbar} container `}>
                        <Link style={brandStyle}  to="/">
                                <img style={brandImageStyle} src="/images/voicer.png" alt="logo image" />
                                <span>Voicer</span>
                        </Link>
                </nav>
        )
}

export default Navigation