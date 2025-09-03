
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

        useEffect(() => {
                // create socket connection
                socket.current = SocketInit()
        }, [])


        const provideRef = useCallback((instance,userId)=>{
                audioElements.current[userId] = instance
        },[])

        const addNewClient = useCallback((newClient,cb)=>{
                const lookingFor = clients.find((client)=>client._id === newClient._id)
                if(lookingFor === undefined){
                        setClients((existingClients)=>{
                                return [...existingClients,newClient]
                        },cb)
                }
        },[clients,setClients])

        // capture media
        useEffect(()=>{
                const startCapture = async() =>{
                        localMediaStreams.current = await navigator.mediaDevices.getUserMedia({
                                audio:true,
                        })
                }
                startCapture().then((res)=>{
                        addNewClient(user,()=>{
                                const localElement = audioElements.current[user._id]
                                if(localElement){
                                        localElement.volume = 0
                                        localElement.srcObject = localMediaStreams.current
                                }

                                // connect to signaling server -socket
                                // emit JOIN - socket io
                                socket.current.emit(ACTIONS.JOIN,{user,roomId})

                        })
                })

                return ()=>{
                        // leave room
                        localMediaStreams.current.getTracks().forEach(track=>{
                                track.stop()
                        })

                        socket.current.emit(ACTIONS.LEAVE,{roomId})
                }
        },[])

        useEffect(()=>{

                const handleNewPeer = async ({peerId,createOffer,user:remoteUser}) =>{
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
                                addNewClient(remoteUser,()=>{
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
                                                },1000)
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

                socket.current.on(ACTIONS.ADD_PEER,handleNewPeer)

                return ()=>{
                        socket.current.off(ACTIONS.ADD_PEER,handleNewPeer)
                }
        },[])

        // handle inc candidate
        useEffect(()=>{

                const handleRelayIce = ({peerId,icecandidate})=>{
                        if(icecandidate){
                                connections.current[peerId].addIceCandidate(icecandidate)
                        }
                }

                socket.current.on(ACTIONS.ICE_CANDIDATE,handleRelayIce)

                return ()=>{
                        socket.current.off(ACTIONS.ICE_CANDIDATE,handleRelayIce)
                }
        },[])

        // handle sdp
        useEffect(()=>{

                const handleRemoteSDP = async ({peerId,sessionDescription:remoteSessionDescription})=>{
                        await connections.current[peerId].setRemoteDescription(new RTCSessionDescription(remoteSessionDescription))

                        // if sdp is type of offer then create answer
                        if(remoteSessionDescription?.type === 'offer'){
                                const answer = await connections.current[peerId].createAnswer()
                                await connections.current[peerId].setLocalDescription(answer)
                                socket.current.emit(ACTIONS.RELAY_SDP,{peerId,sessionDescription:answer})
                        }
                }

                socket.current.on(ACTIONS.SESSION_DESCRIPTION,handleRemoteSDP)

                return ()=>{
                        socket.current.off(ACTIONS.SESSION_DESCRIPTION,handleRemoteSDP)
                }
        },[])

        // handle remove peer

        useEffect(()=>{

                const handleRemovePeer = async({peerId,userId}) => {
                        if(connections.current[peerId]){
                                connections.current[peerId].close()
                        }
                        delete connections.current[peerId]
                        delete audioElements.current[userId]

                        setClients((prev)=>{
                                return prev.filter(client=>client._id !== userId)
                        })

                }

                socket.current.on(ACTIONS.REMOVE_PEER,handleRemovePeer)

                return ()=>{
                        socket.current.off(ACTIONS.REMOVE_PEER,handleRemovePeer)
                }
        },[])

        return { clients ,provideRef }
}

/*


        // setClients((prev)=>{},(state)=>{
        //         // after state update
        // })
*/