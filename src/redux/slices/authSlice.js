import { createSlice } from "@reduxjs/toolkit";

const initialState = {
        isAuth: false,
        user: null,
        otp:{
                phone:'',
                hash:''
        }
}

export const authSlice = createSlice({
        name:"auth",
        initialState,
        reducers:{
                setAuth:(state,action)=>{
                        state.isAuth = true
                        state.user = action.payload.user
                },
                setOtp:(state,action)=>{
                        const {phone,hash} = action.payload
                        state.otp={
                                phone,
                                hash
                        }
                },
                setAuthLogout:(state,action)=>{
                        state.isAuth = false
                        state.user = null
                }
        }
})

export const {setAuth,setOtp,setAuthLogout} = authSlice.actions

export default authSlice