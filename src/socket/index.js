import {io} from 'socket.io-client'


const SocketInit = () => {
        const options = {
                'force new connection': true,
                reconnectionAttempts: 'Infinity',
                timeout: 10000,//ms
                transports: ['websocket']
        }

        return io(import.meta.env.VITE_SERVER_URL, options)
}

export {
        SocketInit
}