import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './Room.module.css'
import { useNavigate, useParams } from 'react-router'
import { useWebRTC } from '../../hooks/useWebRTC'
import { useSelector } from 'react-redux'
import { getRoom } from '../../axios'
import ShareRoomModal from '../../components/modals/ShareRoomModal/ShareRoomModal'
import EnterPasscodeModal from '../../components/modals/EnterPasscodeModal/EnterPasscodeModal'

function Room() {
        const navigate = useNavigate()
        const { roomId } = useParams()
        const { user } = useSelector((store) => store.auth)
        const [room, setRoom] = useState(null)
        const [isMute, setIsMute] = useState(true)
        const [showShareModal, setShowShareModal] = useState(false)
        const [permissionNotice, setPermissionNotice] = useState('')
        const [passcodeVerified, setPasscodeVerified] = useState(false)

        const {
                clients,
                provideRef,
                handleMute,
                toggleRaiseHand,
                grantPermission,
                revokePermission
        } = useWebRTC(roomId, user, room)

        const goBackToRoom = useCallback(() => {
                navigate("/rooms")
        }, [navigate])

        const colors = useMemo(() => {
                return ["#0077FF", "#20BD5F", "#5453E0", "#FF6B00", "#E91E63"]
        }, [])

        useEffect(() => {
                const fetchRoom = async () => {
                        try {
                                const { data } = await getRoom(roomId)
                                if (data?.success) {
                                        setRoom(data.room)
                                }
                        } catch (error) {
                                console.log(error)
                        }
                }
                fetchRoom()
        }, [roomId])

        // Room owner identification (normalized string)
        const ownerIdStr = room?.ownerId?._id
                ? String(room.ownerId._id)
                : (room?.ownerId ? String(room.ownerId) : null)
        const isCurrentUserAdmin = Boolean(ownerIdStr && user?._id && ownerIdStr === String(user._id))

        // Check if closed room requires passcode verification
        const isClosedRoom = room?.roomType === 'closed'
        const hasSessionVerification = Boolean(sessionStorage.getItem(`room_verified_${roomId}`) === 'true')
        const requiresPasscode = Boolean(
                room && isClosedRoom && !isCurrentUserAdmin && !hasSessionVerification && !passcodeVerified
        )

        // Find current user's client state
        const selfClient = clients.find((c) => String(c._id) === String(user?._id))
        const selfCanSpeak = Boolean(selfClient?.canSpeak || isCurrentUserAdmin)

        // Handle mic click
        const handleMuteClicked = useCallback(
                (clientId) => {
                        if (String(clientId) !== String(user._id)) return

                        if (!selfCanSpeak) {
                                setPermissionNotice('✋ You are in the audience. Raise your hand to ask the host for speaking permission!')
                                setTimeout(() => setPermissionNotice(''), 5000)
                                return
                        }

                        const nextMute = !isMute
                        const success = handleMute(nextMute, user._id)
                        if (success !== false) {
                                setIsMute(nextMute)
                        }
                },
                [isMute, user._id, selfCanSpeak, handleMute]
        )

        // Sync local track state when selfCanSpeak changes
        useEffect(() => {
                if (!selfCanSpeak) {
                        setIsMute(true)
                }
        }, [selfCanSpeak])

        // Partition clients into Speakers (Stage) and Listeners (Audience)
        const { speakers, listeners } = useMemo(() => {
                const spkrs = []
                const lstnrs = []

                clients.forEach((client) => {
                        const clientIdStr = String(client._id)
                        const isHost = Boolean(ownerIdStr && clientIdStr === ownerIdStr)
                        const isSpeakerInRoom = Boolean(
                                room?.speakers?.some((s) => String(s._id || s) === clientIdStr)
                        )

                        if (isHost || isSpeakerInRoom || client.canSpeak) {
                                spkrs.push(client)
                        } else {
                                lstnrs.push(client)
                        }
                })

                // Ensure organizer is always first in the speakers list
                spkrs.sort((a, b) => {
                        if (ownerIdStr && String(a._id) === ownerIdStr) return -1
                        if (ownerIdStr && String(b._id) === ownerIdStr) return 1
                        return 0
                })

                return { speakers: spkrs, listeners: lstnrs }
        }, [clients, room, ownerIdStr])

        const roomType = room?.roomType || 'open'
        const pillStyles = {
                open: styles.openPill,
                social: styles.socialPill,
                closed: styles.closedPill
        }

        // If closed room and user is not verified, show passcode gate modal
        if (requiresPasscode) {
                return (
                        <EnterPasscodeModal
                                room={room}
                                onClose={goBackToRoom}
                                onSuccess={() => setPasscodeVerified(true)}
                        />
                )
        }

        return (
                <div>
                        <div className="container">
                                <button className={styles.goBackButton} onClick={goBackToRoom}>
                                        <img src="/images/goback-arror.png" alt="go back arrow" />
                                        <span className={styles.goBackButtonText}>All voice rooms</span>
                                </button>
                        </div>

                        <div className={`${styles.clientsWrapper} container`}>
                                <div className={styles.header}>
                                        <div className={styles.titleWrapper}>
                                                <h3 className={styles.roomTopic}>{room?.roomTopic || 'Voice Room'}</h3>
                                                <span className={`${styles.roomTypePill} ${pillStyles[roomType]}`}>
                                                        {roomType === 'open' && '🌐 Open'}
                                                        {roomType === 'social' && '👥 Social'}
                                                        {roomType === 'closed' && '🔒 Closed'}
                                                </span>

                                                {room?.roomType === 'closed' && isCurrentUserAdmin && room?.passcode && (
                                                        <span
                                                                className={styles.passcodePill}
                                                                onClick={() => setShowShareModal(true)}
                                                                title="Click to view and share room passkey"
                                                        >
                                                                🔑 Passkey: {room.passcode} 📤
                                                        </span>
                                                )}
                                        </div>

                                        <div className={styles.actionButtons}>
                                                <button
                                                        className={styles.shareBtn}
                                                        onClick={() => setShowShareModal(true)}
                                                        title="Share room link & passkey"
                                                >
                                                        <span>📤 Share Room</span>
                                                </button>

                                                <button
                                                        className={`${styles.handRaise} ${
                                                                selfClient?.raisedHand ? styles.handRaiseActive : ''
                                                        }`}
                                                        onClick={toggleRaiseHand}
                                                        title={
                                                                selfClient?.raisedHand
                                                                        ? 'Lower your hand'
                                                                        : 'Raise hand to request speaking permission'
                                                        }
                                                >
                                                        <img src="/images/hand-raise.png" alt="hand raise" />
                                                </button>

                                                <button className={styles.leaveRoom} onClick={goBackToRoom}>
                                                        <img src="/images/leave-room.png" alt="leave room" />
                                                        <span>Leave quietly</span>
                                                </button>
                                        </div>
                                </div>

                                {permissionNotice && (
                                        <div className={styles.permissionNotice}>
                                                <span>{permissionNotice}</span>
                                                <button
                                                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                                                        onClick={() => setPermissionNotice('')}
                                                >
                                                        ✕
                                                </button>
                                        </div>
                                )}

                                {/* TOP SECTION: ORGANIZER & SPEAKERS */}
                                <div className={styles.sectionHeader}>
                                        <span className={styles.sectionTitle}>Speakers</span>
                                        <span className={styles.sectionCount}>{speakers.length}</span>
                                </div>

                                <div className={styles.clientsList}>
                                        {speakers.map((client, index) => {
                                                const isHost = ownerIdStr && String(client._id) === ownerIdStr
                                                const isSelf = String(client._id) === String(user._id)

                                                return (
                                                        <div key={client._id + 'speaker'} className={styles.clientWrapper}>
                                                                <div
                                                                        className={styles.client}
                                                                        style={{
                                                                                border: `4px solid ${colors[index % colors.length]}`
                                                                        }}
                                                                >
                                                                        {isHost && (
                                                                                <span className={styles.organizerBadge} title="Room Organizer / Host">
                                                                                        👑
                                                                                </span>
                                                                        )}

                                                                        <div className={styles.userHead}>
                                                                                <label
                                                                                        htmlFor={`mic-${client._id}`}
                                                                                        className={styles.mic}
                                                                                        onClick={() => handleMuteClicked(client._id)}
                                                                                        title={
                                                                                                isSelf
                                                                                                        ? client.muted
                                                                                                                ? 'Click to Unmute'
                                                                                                                : 'Click to Mute'
                                                                                                        : client.muted
                                                                                                        ? 'Muted'
                                                                                                        : 'Speaking'
                                                                                        }
                                                                                >
                                                                                        <img
                                                                                                className={styles.micOffImage}
                                                                                                src={
                                                                                                        client.muted
                                                                                                                ? '/images/mic_off.png'
                                                                                                                : '/images/mic.png'
                                                                                                }
                                                                                                alt="mic status"
                                                                                        />
                                                                                </label>

                                                                                <audio
                                                                                        id={`mic-${client._id}`}
                                                                                        autoPlay
                                                                                        ref={(instance) => provideRef(instance, client._id)}
                                                                                        className={styles.userAudio}
                                                                                ></audio>

                                                                                <img
                                                                                        src={client?.avatar || '/images/emojiavatar.png'}
                                                                                        alt="user avatar"
                                                                                        className={styles.userAvatar}
                                                                                />
                                                                        </div>
                                                                </div>

                                                                <h4 className={styles.clientName}>
                                                                        {client?.name} {isSelf && '(You)'}
                                                                </h4>

                                                                {/* Host can revoke speaking permission from other speakers */}
                                                                {isCurrentUserAdmin && !isHost && (
                                                                        <div className={styles.moderationActions}>
                                                                                <button
                                                                                        className={styles.revokeBtn}
                                                                                        onClick={() => revokePermission(client._id)}
                                                                                        title="Move to audience and mute"
                                                                                >
                                                                                        Demote
                                                                                </button>
                                                                        </div>
                                                                )}
                                                        </div>
                                                )
                                        })}
                                </div>

                                {/* HORIZONTAL SEPARATOR DIVIDER */}
                                <hr className={styles.stageDivider} />

                                {/* BOTTOM SECTION: AUDIENCE / LISTENERS */}
                                <div className={styles.sectionHeader}>
                                        <span className={styles.sectionTitle}>Others in the room</span>
                                        <span className={styles.sectionCount}>{listeners.length}</span>
                                </div>

                                <div className={styles.clientsList}>
                                        {listeners.length > 0 ? (
                                                listeners.map((client, index) => {
                                                        const isSelf = String(client._id) === String(user._id)

                                                        return (
                                                                <div key={client._id + 'listener'} className={styles.clientWrapper}>
                                                                        <div
                                                                                className={styles.client}
                                                                                style={{
                                                                                        border: `3px solid ${colors[index % colors.length]}`
                                                                                }}
                                                                        >
                                                                                {client.raisedHand && (
                                                                                        <span
                                                                                                className={styles.raisedHandBadge}
                                                                                                title={`${client.name} raised hand to speak!`}
                                                                                        >
                                                                                                ✋
                                                                                        </span>
                                                                                )}

                                                                                <div className={styles.userHead}>
                                                                                        <label
                                                                                                className={`${styles.mic} ${styles.micLocked}`}
                                                                                                onClick={() => handleMuteClicked(client._id)}
                                                                                                title="Audience mic is locked. Raise hand to speak."
                                                                                        >
                                                                                                <img
                                                                                                        className={styles.micOffImage}
                                                                                                        src="/images/mic_off.png"
                                                                                                        alt="mic locked"
                                                                                                />
                                                                                        </label>

                                                                                        <audio
                                                                                                autoPlay
                                                                                                ref={(instance) => provideRef(instance, client._id)}
                                                                                                className={styles.userAudio}
                                                                                        ></audio>

                                                                                        <img
                                                                                                src={client?.avatar || '/images/emojiavatar.png'}
                                                                                                alt="user avatar"
                                                                                                className={styles.userAvatar}
                                                                                        />
                                                                                </div>
                                                                        </div>

                                                                        <h4 className={styles.clientName}>
                                                                                {client?.name} {isSelf && '(You)'}
                                                                        </h4>

                                                                        {/* Admin can grant speaking permission */}
                                                                        {isCurrentUserAdmin && (
                                                                                <div className={styles.moderationActions}>
                                                                                        <button
                                                                                                className={styles.allowBtn}
                                                                                                onClick={() => grantPermission(client._id)}
                                                                                                title="Allow this user to speak"
                                                                                        >
                                                                                                Allow Speak
                                                                                        </button>
                                                                                </div>
                                                                        )}
                                                                </div>
                                                        )
                                                })
                                        ) : (
                                                <p style={{ color: 'var(--secondary-text-color)', fontSize: '14px', marginTop: '10px' }}>
                                                        No listeners currently in the audience.
                                                </p>
                                        )}
                                </div>
                        </div>

                        {/* SHARE ROOM MODAL */}
                        {showShareModal && (
                                <ShareRoomModal
                                        room={room}
                                        onClose={() => setShowShareModal(false)}
                                />
                        )}
                </div>
        )
}

export default Room