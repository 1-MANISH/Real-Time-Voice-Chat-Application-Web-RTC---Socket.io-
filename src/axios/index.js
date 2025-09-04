import axios from "axios"


const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_SERVER_URL,
        withCredentials: true,
        headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
        }
})

// List of all end points

export  const sendOtp =  (data) =>{
       try {
                return axiosInstance.post('/api/v1/send-otp', data)
       } catch (error) {
                console.log(error)
                return error
       }
}

export  const verifyOtp =  (data) =>{
       try {
                return axiosInstance.post('/api/v1/verify-otp', data)
       } catch (error) {
                console.log(error)
                return error
       }
}

export const activateUser = (data) =>{
        try {
                return axiosInstance.post('/api/v1/activate-user', data)
        } catch (error) {
                console.log(error)
                return error
        }
}

export const logoutUser = () =>{
        try {
                return axiosInstance.post('/api/v1/user-logout')
        } catch (error) {
                console.log(error)
                return error
        }
}

export const createRoom = (data) => {
          try {
                return axiosInstance.post('/api/v1/rooms/create', data)
        } catch (error) {
                console.log(error)
                return error
        }

}


export const getAllRooms = () =>{
        try {
                return axiosInstance.get('/api/v1/rooms/all')
        } catch (error) {
                console.log(error)
                return error
        }
}
export const getRoom = (roomId) =>{
        try {
                return axiosInstance.get(`/api/v1/room/${roomId}`)
        } catch (error) {
                console.log(error)
                return error
        }
}


// interceptors

// request interceptor
axiosInstance.interceptors.request.use(function (config) {
        return config
}, function (error) {
        return Promise.reject(error)
})

// response interceptor
axiosInstance.interceptors.response.use(async function (config) {
        return config
},async function(error){
      
        const originalRequest = error.config

        if(error.response.status === 401 && originalRequest && !originalRequest._isRetry){

                originalRequest._isRetry = true
                try {
                        const response =  await axios.get(
                                `${import.meta.env.VITE_SERVER_URL}/api/v1/refresh`,
                                {withCredentials:true}
                        )
                        console.log(response.data)
                        
                        return axiosInstance.request(originalRequest)
                } catch (error) {
                        // console.log(error.message)
                }
        }
        
        return Promise.reject(error)
})



export default axiosInstance
