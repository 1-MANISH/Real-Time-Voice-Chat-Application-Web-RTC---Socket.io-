import React, { useState } from 'react'
import styles from './ShareRoomModal.module.css'
import Button from '../../shared/Button/Button'

function ShareRoomModal({ room, onClose }) {
        const [copied, setCopied] = useState(false)
        const [linkCopied, setLinkCopied] = useState(false)

        const roomLink = `${window.location.origin}/room/${room?._id}`
        const isClosed = room?.roomType === 'closed'
        const passkey = room?.passcode

        const inviteText = isClosed && passkey
                ? `🎙️ Join my private voice room "${room?.roomTopic}" on Voicer!\n🔑 Passkey: ${passkey}\n🔗 Link: ${roomLink}`
                : `🎙️ Join my voice room "${room?.roomTopic}" on Voicer!\n🔗 Link: ${roomLink}`

        const handleCopyAll = () => {
                navigator.clipboard.writeText(inviteText)
                setCopied(true)
                setTimeout(() => setCopied(false), 2500)
        }

        const handleCopyLink = () => {
                navigator.clipboard.writeText(roomLink)
                setLinkCopied(true)
                setTimeout(() => setLinkCopied(false), 2000)
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

                                <h3 className={styles.title}>Share Room Details</h3>
                                <p className={styles.subtitle}>
                                        Invite participants to join "{room?.roomTopic}"
                                </p>

                                {isClosed && passkey && (
                                        <div className={styles.passkeyCard}>
                                                <span className={styles.passkeyLabel}>Room Passkey</span>
                                                <span className={styles.passkeyValue}>{passkey}</span>
                                                <span className={styles.passkeyNotice}>
                                                        ⚠️ Only invitees with this passkey can join this room.
                                                </span>
                                        </div>
                                )}

                                <div className={styles.linkBox}>
                                        <input
                                                type="text"
                                                readOnly
                                                value={roomLink}
                                                className={styles.linkInput}
                                        />
                                        <button className={styles.copySmallBtn} onClick={handleCopyLink}>
                                                {linkCopied ? '✓ Copied' : 'Copy Link'}
                                        </button>
                                </div>

                                <div className={styles.buttonRow}>
                                        <Button
                                                text={copied ? '✓ Invitation Copied!' : 'Copy Full Invitation'}
                                                iconSrc="/images/arrow_forward.png"
                                                width="220px"
                                                onClick={handleCopyAll}
                                        />
                                </div>
                        </div>
                </div>
        )
}

export default ShareRoomModal
