import {configureStore} from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import activationSlice from "./slices/activationSlice"
const store = configureStore({
        reducer:{
                [authSlice.name]: authSlice.reducer,
                [activationSlice.name]:activationSlice.reducer
        }
})

export default store