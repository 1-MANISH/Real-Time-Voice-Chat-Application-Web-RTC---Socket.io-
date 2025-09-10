
import { useCallback, useEffect, useRef } from "react"
import { useStateWithCallback } from "./useStateWithCallback"
import {SocketInit} from "../socket"
import { ACTIONS } from "../socket/actions"
import freeice from 'freeice'


export const useWebRTC = (roomId,user) => {

        const [ clients, setClients ] = useStateWithCallback([])
        const audioElements = useRef({})
        const connections = useRef({})
        const localMediaStreams = useRef(null)
        const socket = useRef(null)
        const clientsRef = useRef([])

        const addNewClient = useCallback((newClient,cb)=>{
                const lookingFor = clients.find((client)=>client._id === newClient._id)
                if(lookingFor === undefined){
                        setClients((existingClients)=>{
                                return [...existingClients,newClient]
                        },cb)
                }
        },[clients,setClients])

        // our clients
        useEffect(()=>{
                clientsRef.current = clients
        },[clients])


        // main
        useEffect(()=>{
                const initChat = async () => {
                        // 1 socket connection
                        socket.current = SocketInit()

                        await captureMedia()

                        addNewClient({...user,muted:true},()=>{
                                const localElement = audioElements.current[user._id]
                                if(localElement){
                                        localElement.volume = 0
                                        localElement.srcObject = localMediaStreams.current
                                }
                        })

                        socket.current.on(ACTIONS.MUTE_INFO,({userId,isMute})=>{
                                handleMute(isMute,userId)
                        })
                        socket.current.on(ACTIONS.ADD_PEER,handleNewPeer)
                        socket.current.on(ACTIONS.REMOVE_PEER,handleRemovePeer)
                        socket.current.on(ACTIONS.ICE_CANDIDATE,handleIceCandidate)
                        socket.current.on(ACTIONS.SESSION_DESCRIPTION,setRemoteMedia)
                        socket.current.on(ACTIONS.MUTE,({peerId,userId})=>{
                                handleMute(true,userId)
                        })
                        socket.current.on(ACTIONS.UNMUTE,({peerId,userId})=>{
                                handleMute(false,userId)
                        })
                        socket.current.emit(ACTIONS.JOIN,{roomId,user})

                        async function captureMedia(){
                                 localMediaStreams.current = await navigator.mediaDevices.getUserMedia({
                                        audio:true,
                                })
                        }

                        async function handleNewPeer({peerId,createOffer,user:remoteUser}){
                                // if already connected then give warning
                                if(peerId in connections.current){
                                        console.warn(`You are already connected with ${peerId} (${remoteUser.name})`)
                                        // connection={socketId:connection}
                                        return
                                }

                                //create peer connection
                                connections.current[peerId] = new RTCPeerConnection({
                                        iceServers: freeice()
                                })

                                // handler new ice candidate
                                connections.current[peerId].onicecandidate = (event)=>{
                                        socket.current.emit(ACTIONS.RELAY_ICE,{
                                                peerId,
                                                icecandidate:event.candidate
                                        })
                                }

                                // handle 0n track on this connection
                                connections.current[peerId].ontrack = ({streams:[remoteStream]})=>{
                                        addNewClient({...remoteUser,muted:true},()=>{

                                                const currentUser = clientsRef.current.find(
                                                        client=>client._id === remoteUser._id
                                                )

                                                if(currentUser){
                                                        socket.current.emit(
                                                                ACTIONS.MUTE_INFO,
                                                                {
                                                                        userId:user._id,
                                                                        roomId,
                                                                        isMute:currentUser.muted
                                                                }
                                                        )
                                                }

                                                if(audioElements.current[remoteUser._id]){
                                                        audioElements.current[remoteUser._id].srcObject = remoteStream
                                                }else{
                                                        let settled = false
                                                        let interval = setInterval(()=>{
                                                                if(audioElements.current[remoteUser._id]){
                                                                        audioElements.current[remoteUser._id].srcObject = remoteStream
                                                                        settled = true
                                                                        
                                                                }
                                                                if(settled){
                                                                        clearInterval(interval)
                                                                }
                                                        },300)
                                                }
                                        })
                                }

                                // add local track to remote connections
                                localMediaStreams.current.getTracks().forEach((track)=>{
                                        connections.current[peerId].addTrack(track,localMediaStreams.current)
                                })

                                // create offer
                                if(createOffer){
                                        const offer = await connections.current[peerId].createOffer()
                                        await connections.current[peerId].setLocalDescription(offer)
                                        // send offer to other peer
                                        socket.current.emit(ACTIONS.RELAY_SDP,{
                                                peerId,
                                                sessionDescription:offer
                                        })
                                }
                        }

                        async function handleRemovePeer({peerId,userId}){
                                if(connections.current[peerId]){
                                        connections.current[peerId].close()
                                }
                                delete connections.current[peerId]
                                delete audioElements.current[peerId]

                                setClients(list=>list.filter(client=>client._id !== userId))
                        }

                        async function handleIceCandidate({peerId,icecandidate}){
                                if(icecandidate){
                                        connections.current[peerId].addIceCandidate(icecandidate)
                                }
                        }

                        async function setRemoteMedia({peerId,sessionDescription:remoteSessionDescription}){
                                connections.current[peerId].setRemoteDescription(
                                        new RTCSessionDescription(remoteSessionDescription)
                                )

                                if(remoteSessionDescription.type === "offer"){
                                        const answer = await connections.current[peerId].createAnswer()

                                        socket.current.emit(ACTIONS.RELAY_SDP,{
                                                peerId,
                                                sessionDescription:answer
                                        })
                                }
                        }

                        async function handleMute(isMute,userId){
                                const clientIdx = clientsRef.current.map(client=>client._id).indexOf(userId)
                                const connectedClients = JSON.parse(JSON.stringify(clientsRef.current))
                                if(clientIdx > -1){
                                        connectedClients[clientIdx].muted = isMute
                                        setClients(connectedClients)
                                }
                        }
                }

                initChat()

                return () => {
                        localMediaStreams.current.getTracks().forEach(track=>track.stop())
                        socket.current.emit(ACTIONS.LEAVE,{roomId})
                        for(let peerId in connections.current){
                                connections.current[peerId].close()
                                delete connections.current[peerId]
                                delete audioElements.current[peerId]
                        }

                        socket.current.off(ACTIONS.ADD_PEER)
                        socket.current.off(ACTIONS.REMOVE_PEER)
                        socket.current.off(ACTIONS.ICE_CANDIDATE)
                        socket.current.off(ACTIONS.SESSION_DESCRIPTION)
                        socket.current.off(ACTIONS.MUTE)
                        socket.current.off(ACTIONS.UNMUTE)
                }
        },[])


        const provideRef = useCallback((instance,userId)=>{
                audioElements.current[userId] = instance
        },[])


        const handleMute = useCallback((isMute,userId)=>{
                let settled = false
                let interval= setInterval(()=>{
                        if(localMediaStreams.current){
                                localMediaStreams.current.getTracks()[0].enabled = !isMute
                                if(isMute){
                                        // web socket or tracks
                                        socket.current.emit(ACTIONS.MUTE,{
                                                roomId,
                                                userId
                                        })
                                }else{
                                        socket.current.emit(ACTIONS.UNMUTE,{
                                                roomId,
                                                userId
                                        })
                                }
                                settled = true
                        }
                        if(settled){
                                clearInterval(interval)
                        }
                },200)
        },[])

        return { clients ,provideRef,handleMute }
}

/*


        // setClients((prev)=>{},(state)=>{
        //         // after state update
        // })
*/