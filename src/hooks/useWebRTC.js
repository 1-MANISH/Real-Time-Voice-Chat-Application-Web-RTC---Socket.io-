import { useCallback, useEffect, useRef } from "react"
import { useStateWithCallback } from "./useStateWithCallback"
import { SocketInit } from "../socket"
import { ACTIONS } from "../socket/actions"
import freeice from 'freeice'

export const useWebRTC = (roomId, user, room) => {
        const [clients, setClients] = useStateWithCallback([])
        const audioElements = useRef({})
        const connections = useRef({})
        const localMediaStreams = useRef(null)
        const socket = useRef(null)
        const clientsRef = useRef([])
        const roomRef = useRef(room)

        useEffect(() => {
                roomRef.current = room
        }, [room])

        const addNewClient = useCallback((newClient, cb) => {
                setClients((existingClients) => {
                        const index = existingClients.findIndex((client) => String(client._id) === String(newClient._id))
                        if (index === -1) {
                                return [...existingClients, newClient]
                        }
                        const updated = [...existingClients]
                        updated[index] = {
                                ...updated[index],
                                ...newClient,
                                canSpeak: updated[index].canSpeak || newClient.canSpeak,
                                isOwner: updated[index].isOwner || newClient.isOwner
                        }
                        return updated
                }, cb)
        }, [setClients])

        // Keep clientsRef in sync
        useEffect(() => {
                clientsRef.current = clients
        }, [clients])

        // Sync owner/speaker status when room details arrive
        useEffect(() => {
                if (!room) return
                const ownerIdStr = room.ownerId?._id ? String(room.ownerId._id) : (room.ownerId ? String(room.ownerId) : null)
                setClients((existing) =>
                        existing.map((client) => {
                                const clientIdStr = String(client._id)
                                const isOwner = Boolean(ownerIdStr && clientIdStr === ownerIdStr)
                                const isSpeaker = Boolean(room.speakers?.some((s) => String(s._id || s) === clientIdStr))
                                if (isOwner || isSpeaker) {
                                        return { ...client, canSpeak: true, isOwner }
                                }
                                return { ...client, isOwner }
                        })
                )
        }, [room, setClients])

        // Main WebRTC & Socket setup
        useEffect(() => {
                const initChat = async () => {
                        socket.current = SocketInit()

                        await captureMedia()

                        const currentOwnerIdStr = roomRef.current?.ownerId?._id
                                ? String(roomRef.current.ownerId._id)
                                : (roomRef.current?.ownerId ? String(roomRef.current.ownerId) : null)
                        const isSelfOwner = Boolean(currentOwnerIdStr && currentOwnerIdStr === String(user._id))

                        addNewClient(
                                {
                                        ...user,
                                        muted: true,
                                        raisedHand: false,
                                        canSpeak: isSelfOwner,
                                        isOwner: isSelfOwner
                                },
                                () => {
                                        const localElement = audioElements.current[user._id]
                                        if (localElement) {
                                                localElement.volume = 0
                                                localElement.srcObject = localMediaStreams.current
                                        }
                                }
                        )

                        // Mute listeners
                        socket.current.on(ACTIONS.MUTE_INFO, ({ userId, isMute }) => {
                                handleRemoteMute(isMute, userId)
                        })

                        socket.current.on(ACTIONS.ADD_PEER, handleNewPeer)
                        socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer)
                        socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate)
                        socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia)
                        socket.current.on(ACTIONS.MUTE, ({ userId }) => {
                                handleRemoteMute(true, userId)
                        })
                        socket.current.on(ACTIONS.UNMUTE, ({ userId }) => {
                                handleRemoteMute(false, userId)
                        })

                        // Hand raise & permission listeners
                        socket.current.on(ACTIONS.RAISE_HAND, ({ userId }) => {
                                setClients((existing) =>
                                        existing.map((c) => (c._id === userId ? { ...c, raisedHand: true } : c))
                                )
                        })

                        socket.current.on(ACTIONS.LOWER_HAND, ({ userId }) => {
                                setClients((existing) =>
                                        existing.map((c) => (c._id === userId ? { ...c, raisedHand: false } : c))
                                )
                        })

                        socket.current.on(ACTIONS.GRANT_SPEAK_PERMISSION, ({ userId }) => {
                                setClients((existing) =>
                                        existing.map((c) =>
                                                c._id === userId
                                                        ? { ...c, canSpeak: true, raisedHand: false }
                                                        : c
                                        )
                                )
                        })

                        socket.current.on(ACTIONS.REVOKE_SPEAK_PERMISSION, ({ userId }) => {
                                if (userId === user._id) {
                                        if (localMediaStreams.current) {
                                                localMediaStreams.current.getTracks().forEach((track) => {
                                                        track.enabled = false
                                                })
                                        }
                                        socket.current.emit(ACTIONS.MUTE, { roomId, userId })
                                }
                                setClients((existing) =>
                                        existing.map((c) =>
                                                c._id === userId
                                                        ? { ...c, canSpeak: false, muted: true, raisedHand: false }
                                                        : c
                                        )
                                )
                        })

                        socket.current.emit(ACTIONS.JOIN, { roomId, user })

                        async function captureMedia() {
                                try {
                                        localMediaStreams.current = await navigator.mediaDevices.getUserMedia({
                                                audio: true
                                        })
                                        // initially mic is off
                                        localMediaStreams.current.getTracks().forEach((t) => (t.enabled = false))
                                } catch (err) {
                                        console.log("Error capturing user media:", err)
                                }
                        }

                        async function handleNewPeer({ peerId, createOffer, user: remoteUser }) {
                                if (!remoteUser) return
                                if (peerId in connections.current) {
                                        console.warn(`Already connected with ${peerId} (${remoteUser.name})`)
                                        return
                                }

                                connections.current[peerId] = new RTCPeerConnection({
                                        iceServers: freeice()
                                })

                                connections.current[peerId].onicecandidate = (event) => {
                                        if (event.candidate) {
                                                socket.current.emit(ACTIONS.RELAY_ICE, {
                                                        peerId,
                                                        icecandidate: event.candidate
                                                })
                                        }
                                }

                                connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
                                        const remoteOwnerIdStr = roomRef.current?.ownerId?._id
                                                ? String(roomRef.current.ownerId._id)
                                                : (roomRef.current?.ownerId ? String(roomRef.current.ownerId) : null)
                                        const remoteUserIdStr = String(remoteUser._id)
                                        const isRemoteOwner = Boolean(
                                                remoteOwnerIdStr && remoteOwnerIdStr === remoteUserIdStr
                                        )
                                        const isRemoteSpeaker = Boolean(
                                                roomRef.current?.speakers?.some((s) => String(s._id || s) === remoteUserIdStr)
                                        )
                                        const canRemoteSpeak = isRemoteOwner || isRemoteSpeaker

                                        addNewClient(
                                                {
                                                        ...remoteUser,
                                                        muted: true,
                                                        raisedHand: false,
                                                        canSpeak: canRemoteSpeak,
                                                        isOwner: isRemoteOwner
                                                },
                                                () => {
                                                        const currentUser = clientsRef.current.find(
                                                                (client) => client._id === remoteUser._id
                                                        )

                                                        if (currentUser) {
                                                                socket.current.emit(ACTIONS.MUTE_INFO, {
                                                                        userId: user._id,
                                                                        roomId,
                                                                        isMute: currentUser.muted
                                                                })
                                                        }

                                                        if (audioElements.current[remoteUser._id]) {
                                                                audioElements.current[remoteUser._id].srcObject = remoteStream
                                                        } else {
                                                                let settled = false
                                                                let interval = setInterval(() => {
                                                                        if (audioElements.current[remoteUser._id]) {
                                                                                audioElements.current[remoteUser._id].srcObject = remoteStream
                                                                                settled = true
                                                                        }
                                                                        if (settled) {
                                                                                clearInterval(interval)
                                                                        }
                                                                }, 300)
                                                        }
                                                }
                                        )
                                }

                                if (localMediaStreams.current) {
                                        localMediaStreams.current.getTracks().forEach((track) => {
                                                connections.current[peerId].addTrack(
                                                        track,
                                                        localMediaStreams.current
                                                )
                                        })
                                }

                                if (createOffer) {
                                        const offer = await connections.current[peerId].createOffer()
                                        await connections.current[peerId].setLocalDescription(offer)
                                        socket.current.emit(ACTIONS.RELAY_SDP, {
                                                peerId,
                                                sessionDescription: offer
                                        })
                                }
                        }

                        async function handleRemovePeer({ peerId, userId }) {
                                if (connections.current[peerId]) {
                                        connections.current[peerId].close()
                                }
                                delete connections.current[peerId]
                                delete audioElements.current[peerId]

                                setClients((list) => list.filter((client) => client._id !== userId))
                        }

                        async function handleIceCandidate({ peerId, icecandidate }) {
                                if (icecandidate && connections.current[peerId]) {
                                        try {
                                                await connections.current[peerId].addIceCandidate(icecandidate)
                                        } catch (err) {
                                                console.error("Error adding ice candidate:", err)
                                        }
                                }
                        }

                        async function setRemoteMedia({ peerId, sessionDescription: remoteSessionDescription }) {
                                if (!connections.current[peerId]) return
                                try {
                                        await connections.current[peerId].setRemoteDescription(
                                                new RTCSessionDescription(remoteSessionDescription)
                                        )

                                        if (remoteSessionDescription.type === "offer") {
                                                const answer = await connections.current[peerId].createAnswer()
                                                await connections.current[peerId].setLocalDescription(answer)
                                                socket.current.emit(ACTIONS.RELAY_SDP, {
                                                        peerId,
                                                        sessionDescription: answer
                                                })
                                        }
                                } catch (err) {
                                        console.error("Error handling SDP:", err)
                                }
                        }

                        function handleRemoteMute(isMute, userId) {
                                setClients((existing) =>
                                        existing.map((client) =>
                                                client._id === userId ? { ...client, muted: isMute } : client
                                        )
                                )
                        }
                }

                initChat()

                return () => {
                        if (localMediaStreams.current) {
                                localMediaStreams.current.getTracks().forEach((track) => track.stop())
                        }
                        if (socket.current) {
                                socket.current.emit(ACTIONS.LEAVE, { roomId })
                                socket.current.off(ACTIONS.ADD_PEER)
                                socket.current.off(ACTIONS.REMOVE_PEER)
                                socket.current.off(ACTIONS.ICE_CANDIDATE)
                                socket.current.off(ACTIONS.SESSION_DESCRIPTION)
                                socket.current.off(ACTIONS.MUTE)
                                socket.current.off(ACTIONS.UNMUTE)
                                socket.current.off(ACTIONS.MUTE_INFO)
                                socket.current.off(ACTIONS.RAISE_HAND)
                                socket.current.off(ACTIONS.LOWER_HAND)
                                socket.current.off(ACTIONS.GRANT_SPEAK_PERMISSION)
                                socket.current.off(ACTIONS.REVOKE_SPEAK_PERMISSION)
                        }

                        for (let peerId in connections.current) {
                                connections.current[peerId].close()
                                delete connections.current[peerId]
                                delete audioElements.current[peerId]
                        }
                }
        }, [roomId, user, addNewClient, setClients])

        const provideRef = useCallback((instance, userId) => {
                audioElements.current[userId] = instance
        }, [])

        const handleMute = useCallback(
                (isMute, userId) => {
                        const client = clientsRef.current.find((c) => c._id === userId)
                        // If unmuting, verify user is permitted to speak!
                        if (!isMute && client && !client.canSpeak) {
                                return false
                        }

                        let settled = false
                        let interval = setInterval(() => {
                                if (localMediaStreams.current) {
                                        const audioTrack = localMediaStreams.current.getTracks()[0]
                                        if (audioTrack) {
                                                audioTrack.enabled = !isMute
                                        }
                                        if (isMute) {
                                                socket.current.emit(ACTIONS.MUTE, {
                                                        roomId,
                                                        userId
                                                })
                                        } else {
                                                socket.current.emit(ACTIONS.UNMUTE, {
                                                        roomId,
                                                        userId
                                                })
                                        }
                                        settled = true
                                }
                                if (settled) {
                                        clearInterval(interval)
                                }
                        }, 200)

                        setClients((existing) =>
                                existing.map((c) => (c._id === userId ? { ...c, muted: isMute } : c))
                        )
                        return true
                },
                [roomId, setClients]
        )

        const toggleRaiseHand = useCallback(() => {
                const self = clientsRef.current.find((c) => c._id === user._id)
                const nextState = !self?.raisedHand

                if (nextState) {
                        socket.current.emit(ACTIONS.RAISE_HAND, { roomId, userId: user._id })
                } else {
                        socket.current.emit(ACTIONS.LOWER_HAND, { roomId, userId: user._id })
                }

                setClients((existing) =>
                        existing.map((c) => (c._id === user._id ? { ...c, raisedHand: nextState } : c))
                )
        }, [roomId, user._id, setClients])

        const grantPermission = useCallback(
                (userId) => {
                        socket.current.emit(ACTIONS.GRANT_SPEAK_PERMISSION, { roomId, userId })
                        setClients((existing) =>
                                existing.map((c) =>
                                        c._id === userId
                                                ? { ...c, canSpeak: true, raisedHand: false }
                                                : c
                                )
                        )
                },
                [roomId, setClients]
        )

        const revokePermission = useCallback(
                (userId) => {
                        socket.current.emit(ACTIONS.REVOKE_SPEAK_PERMISSION, { roomId, userId })
                        setClients((existing) =>
                                existing.map((c) =>
                                        c._id === userId
                                                ? { ...c, canSpeak: false, muted: true, raisedHand: false }
                                                : c
                                )
                        )
                },
                [roomId, setClients]
        )

        return {
                clients,
                provideRef,
                handleMute,
                toggleRaiseHand,
                grantPermission,
                revokePermission
        }
}