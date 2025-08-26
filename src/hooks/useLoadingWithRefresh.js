import { useEffect, useState } from "react";
import axiosInstance from "../axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../redux/slices/authSlice";

export function useLoadingWithRefresh() {

       const [loading,setLoading] = useState(true)
       const dispatch = useDispatch()

       useEffect(()=>{
              (async()=>{
                       setLoading(true)
                       try {
                                const {data} = await axiosInstance.get('/api/v1/refresh',{withCredentials:true})
                                dispatch(setAuth(data))
                       } catch (error) {
                               console.log(error)
                       }finally{
                               setLoading(false)
                       }
              })()
       },[])

       return {loading}
}