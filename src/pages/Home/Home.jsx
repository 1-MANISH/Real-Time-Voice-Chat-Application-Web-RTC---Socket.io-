import React, { useCallback } from 'react'
import styles from './Home.module.css'
import { useNavigate } from 'react-router'
import Button from '../../components/shared/Button/Button'

function Home() {
        const navigate = useNavigate()

        const startAuthentication = useCallback(
                (e) => {
                        if (e) e.preventDefault()
                        navigate('/authenticate')
                },
                [navigate]
        )

        return (
                <div className={`${styles.homeContainer} container`}>
                        {/* HERO SECTION */}
                        <div className={styles.heroSection}>
                                <div className={styles.heroBadge}>
                                        <span>🎙️ The Real-Time Voice Platform</span>
                                </div>

                                <h1 className={styles.heroHeading}>
                                        Drop into live conversations with <br />
                                        <span className={styles.heroHighlight}>voices around the globe.</span>
                                </h1>

                                <p className={styles.heroSubtitle}>
                                        Join open discussions, host private voice rooms with your circle, raise your hand
                                        to talk, and connect with people anywhere using crystal-clear WebRTC audio.
                                </p>

                                <div className={styles.ctaWrapper}>
                                        <Button
                                                text="Get Started Free"
                                                iconSrc="/images/arrow_forward.png"
                                                onClick={startAuthentication}
                                        />
                                        <button className={styles.secondaryCtaBtn} onClick={startAuthentication}>
                                                <img src="/images/telephone.png" alt="phone" style={{ width: 16 }} />
                                                <span>Sign In with Phone or Email</span>
                                        </button>
                                </div>
                        </div>

                        {/* LIVE ROOM PREVIEW */}
                        <div className={styles.previewWrapper}>
                                <div className={styles.previewCard}>
                                        <div className={styles.previewHeader}>
                                                <div className={styles.previewLiveBadge}>
                                                        <span className={styles.liveDot}></span>
                                                        <span>LIVE NOW</span>
                                                </div>
                                                <span style={{ fontSize: '13px', color: 'var(--secondary-text-color)' }}>
                                                        🌐 Open Room
                                                </span>
                                        </div>

                                        <h3 className={styles.previewTopic}>
                                                What's next in AI, WebRTC & Real-time systems?
                                        </h3>

                                        <div className={styles.previewSpeakers}>
                                                <img
                                                        src="/images/emojiman.png"
                                                        alt="Speaker"
                                                        className={styles.previewAvatar}
                                                />
                                                <div className={styles.previewSpeakerInfo}>
                                                        <span className={styles.previewSpeakerName}>
                                                                Hardik P 👑 <span style={{ fontSize: 12, color: '#20BD5F' }}>Speaking</span>
                                                        </span>
                                                        <span className={styles.previewSpeakerRole}>
                                                                Room Organizer & Lead Speaker
                                                        </span>
                                                </div>
                                        </div>

                                        <div className={styles.previewFooter}>
                                                <span>👥 14 listeners tuned in</span>
                                                <span
                                                        onClick={startAuthentication}
                                                        style={{
                                                                color: 'var(--primary-button-bg-color)',
                                                                cursor: 'pointer',
                                                                fontWeight: 700
                                                        }}
                                                >
                                                        Join Conversation →
                                                </span>
                                        </div>
                                </div>
                        </div>

                        {/* KEY FEATURES GRID */}
                        <div className={styles.featuresGrid}>
                                <div className={styles.featureCard}>
                                        <div className={styles.featureIcon}>⚡</div>
                                        <h3 className={styles.featureTitle}>Real-Time Audio</h3>
                                        <p className={styles.featureDesc}>
                                                Ultra low-latency peer-to-peer audio streaming powered by WebRTC for seamless, natural voice discussions.
                                        </p>
                                </div>

                                <div className={styles.featureCard}>
                                        <div className={styles.featureIcon}>✋</div>
                                        <h3 className={styles.featureTitle}>Raise Hand & Moderation</h3>
                                        <p className={styles.featureDesc}>
                                                Listeners can raise their hands to speak. Room hosts have granular control to grant or revoke mic permissions.
                                        </p>
                                </div>

                                <div className={styles.featureCard}>
                                        <div className={styles.featureIcon}>🔒</div>
                                        <h3 className={styles.featureTitle}>Social & Closed Rooms</h3>
                                        <p className={styles.featureDesc}>
                                                Create open public discussions, social hangouts, or passcoded closed rooms for private team meetings.
                                        </p>
                                </div>

                                <div className={styles.featureCard}>
                                        <div className={styles.featureIcon}>🛡️</div>
                                        <h3 className={styles.featureTitle}>Fast OTP Authentication</h3>
                                        <p className={styles.featureDesc}>
                                                Log in swiftly using either your mobile number or your email address with instant OTP verification.
                                        </p>
                                </div>
                        </div>

                        {/* BOTTOM BANNER */}
                        <div className={styles.bannerSection}>
                                <h2 className={styles.bannerTitle}>Ready to start your first voice conversation?</h2>
                                <p className={styles.bannerText}>
                                        Create a room in seconds or join any ongoing discussion. No setup required.
                                </p>
                                <Button
                                        text="Start Talking Now"
                                        iconSrc="/images/celebration.png"
                                        onClick={startAuthentication}
                                />
                        </div>
                </div>
        )
}

export default Home