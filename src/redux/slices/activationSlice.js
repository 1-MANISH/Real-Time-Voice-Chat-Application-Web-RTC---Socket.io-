import { createSlice } from "@reduxjs/toolkit";

const initialState = {
        name:'',
        avatar:'',

}

export const activationSlice = createSlice({
        name:"activation",
        initialState,
        reducers:{
                setName:(state,action)=>{
                        state.name = action.payload
                },
                setAvatar:(state,action)=>{
                        state.avatar = action.payload
                },
        }
})

export const {setName,setAvatar} = activationSlice.actions

export default activationSlice