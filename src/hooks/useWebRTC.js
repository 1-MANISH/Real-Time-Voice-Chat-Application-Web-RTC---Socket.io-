
import { useCallback, useEffect, useRef } from "react"
import { useStateWithCallback } from "./useStateWithCallback"
import {SocketInit} from "../socket"
import { ACTIONS } from "../socket/actions"

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

        const addNewClients = useCallback((newClient,cb)=>{
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
                        addNewClients(user,()=>{
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
        },[])

        return { clients ,provideRef }
}

/*


        // setClients((prev)=>{},(state)=>{
        //         // after state update
        // })
*/