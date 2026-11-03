import React, { useCallback, useEffect, useState } from 'react'
import styles from './Profile.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { getUserProfile, updateUserProfile } from '../../axios'
import { setAuth } from '../../redux/slices/authSlice'
import Button from '../../components/shared/Button/Button'
import Loader from '../../components/shared/Loader/Loader'

function Profile() {
        const navigate = useNavigate()
        const dispatch = useDispatch()
        const { user } = useSelector((store) => store.auth)

        const [name, setName] = useState(user?.name || '')
        const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '/images/emojiavatar.png')
        const [newAvatarData, setNewAvatarData] = useState(null)
        const [roomsCount, setRoomsCount] = useState(0)
        const [loading, setLoading] = useState(false)
        const [pageLoading, setPageLoading] = useState(true)
        const [message, setMessage] = useState({ text: '', isError: false })

        useEffect(() => {
                const fetchProfile = async () => {
                        try {
                                const { data } = await getUserProfile()
                                if (data?.success) {
                                        setName(data.user.name || '')
                                        setAvatarPreview(data.user.avatar || '/images/emojiavatar.png')
                                        setRoomsCount(data.roomsCount || 0)
                                }
                        } catch (err) {
                                console.log(err)
                        } finally {
                                setPageLoading(false)
                        }
                }
                fetchProfile()
        }, [])

        const handleImageChange = (e) => {
                const file = e.target.files[0]
                if (!file) return
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onloadend = () => {
                        setAvatarPreview(reader.result)
                        setNewAvatarData(reader.result)
                }
        }

        const handleSave = useCallback(async () => {
                if (!name.trim()) {
                        setMessage({ text: 'Name cannot be empty', isError: true })
                        return
                }

                setLoading(true)
                setMessage({ text: '', isError: false })

                try {
                        const payload = {
                                name: name.trim(),
                                ...(newAvatarData ? { avatar: newAvatarData } : {})
                        }
                        const { data } = await updateUserProfile(payload)
                        if (data?.success) {
                                dispatch(setAuth({ user: data.user }))
                                setMessage({ text: 'Profile updated successfully!', isError: false })
                                setNewAvatarData(null)
                        } else {
                                setMessage({ text: data?.message || 'Failed to update profile', isError: true })
                        }
                } catch (err) {
                        console.log(err)
                        setMessage({ text: err?.response?.data?.message || 'Update failed', isError: true })
                } finally {
                        setLoading(false)
                }
        }, [name, newAvatarData, dispatch])

        if (pageLoading) {
                return <Loader message="Loading profile..." mt="15rem" />
        }

        const memberSince = user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                  })
                : 'Recently'

        return (
                <div className={`${styles.profileWrapper} container`}>
                        <button className={styles.backButton} onClick={() => navigate('/rooms')}>
                                <img src="/images/goback-arror.png" alt="back" className={styles.backArrow} />
                                <span>Back to rooms</span>
                        </button>

                        <div className={styles.profileCard}>
                                <div className={styles.cardHeader}>
                                        <label htmlFor="avatar-upload" className={styles.avatarContainer}>
                                                <img
                                                        src={avatarPreview}
                                                        alt="User Avatar"
                                                        className={styles.avatarImage}
                                                />
                                                <div className={styles.avatarOverlay}>
                                                        <span>Change</span>
                                                </div>
                                        </label>
                                        <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                className={styles.fileInput}
                                                onChange={handleImageChange}
                                        />

                                        <h2 className={styles.nameHeading}>{user?.name}</h2>
                                        <span className={styles.badge}>Active Member</span>
                                </div>

                                <div className={styles.statsRow}>
                                        <div className={styles.statItem}>
                                                <span className={styles.statValue}>{roomsCount}</span>
                                                <span className={styles.statLabel}>Rooms Hosted</span>
                                        </div>
                                        <div className={styles.statItem}>
                                                <span className={styles.statValue}>{memberSince}</span>
                                                <span className={styles.statLabel}>Member Since</span>
                                        </div>
                                </div>

                                <div className={styles.infoGrid}>
                                        <div className={styles.infoItem}>
                                                <label className={styles.infoLabel}>Display Name</label>
                                                <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className={styles.nameInput}
                                                        placeholder="Enter your name"
                                                />
                                        </div>

                                        {user?.phone && (
                                                <div className={styles.infoItem}>
                                                        <span className={styles.infoLabel}>Phone Number</span>
                                                        <span className={styles.infoValue}>{user.phone}</span>
                                                </div>
                                        )}

                                        {user?.email && (
                                                <div className={styles.infoItem}>
                                                        <span className={styles.infoLabel}>Email Address</span>
                                                        <span className={styles.infoValue}>{user.email}</span>
                                                </div>
                                        )}
                                </div>

                                {message.text && (
                                        <p
                                                className={`${styles.feedbackMsg} ${
                                                        message.isError ? styles.error : styles.success
                                                }`}
                                        >
                                                {message.text}
                                        </p>
                                )}

                                <div className={styles.actionRow}>
                                        <Button
                                                text={loading ? 'Saving...' : 'Save Changes'}
                                                iconSrc="/images/arrow_forward.png"
                                                width="180px"
                                                onClick={handleSave}
                                                disabled={loading}
                                        />
                                </div>
                        </div>
                </div>
        )
}

export default Profile
