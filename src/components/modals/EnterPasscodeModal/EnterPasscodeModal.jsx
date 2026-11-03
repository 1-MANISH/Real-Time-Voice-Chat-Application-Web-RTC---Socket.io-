import React, { useState } from 'react'
import styles from './EnterPasscodeModal.module.css'
import { useNavigate } from 'react-router'
import { verifyRoomPasscode } from '../../../axios'
import Button from '../../shared/Button/Button'

function EnterPasscodeModal({ room, onClose, onSuccess }) {
        const navigate = useNavigate()
        const [passcode, setPasscode] = useState('')
        const [error, setError] = useState('')
        const [loading, setLoading] = useState(false)

        const handleVerify = async () => {
                if (!passcode.trim()) {
                        setError('Please enter the room passcode')
                        return
                }

                setLoading(true)
                setError('')

                try {
                        const { data } = await verifyRoomPasscode(room._id, { passcode: passcode.trim() })
                        if (data?.success) {
                                sessionStorage.setItem(`room_verified_${room._id}`, 'true')
                                if (onSuccess) {
                                        onSuccess()
                                }
                                onClose()
                                navigate(`/room/${room._id}`)
                        } else {
                                setError(data?.message || 'Invalid passcode')
                        }
                } catch (err) {
                        console.log(err)
                        setError(err?.response?.data?.message || 'Incorrect passcode for this room')
                } finally {
                        setLoading(false)
                }
        }

        const handleKeyDown = (e) => {
                if (e.key === 'Enter') {
                        handleVerify()
                }
        }

        const handleOutsideClick = (e) => {
                if (e.target.classList.contains(styles.modalMask)) {
                        onClose()
                }
        }

        return (
                <div className={styles.modalMask} onClick={handleOutsideClick}>
                        <div className={styles.modalBody}>
                                <button className={styles.closeBtn} onClick={onClose}>
                                        <img src="/images/close.png" alt="close" className={styles.closeIcon} />
                                </button>

                                <img src="/images/lock-type.png" alt="locked" className={styles.lockIcon} />
                                <h3 className={styles.title}>Private Room</h3>
                                <p className={styles.subtitle}>
                                        "{room?.roomTopic}" requires a passcode to join.
                                </p>

                                <input
                                        type="password"
                                        maxLength={6}
                                        value={passcode}
                                        onChange={(e) => setPasscode(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className={styles.input}
                                        placeholder="••••"
                                        autoFocus
                                />

                                {error && <p className={styles.error}>{error}</p>}

                                <div className={styles.buttonRow}>
                                        <Button
                                                text={loading ? 'Checking...' : 'Join Room'}
                                                iconSrc="/images/arrow_forward.png"
                                                width="160px"
                                                onClick={handleVerify}
                                                disabled={loading}
                                        />
                                </div>
                        </div>
                </div>
        )
}

export default EnterPasscodeModal
