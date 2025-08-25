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

export default axiosInstance
