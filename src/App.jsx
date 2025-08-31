import React, { lazy } from 'react'
import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router"
import GuestRoute from './components/routes/GuestRoute.jsx'
import SemiProtectedRoute from './components/routes/SemiProtectedRoute.jsx'
import ProtectedRoute from './components/routes/ProtectedRoute.jsx'
import {useSelector} from 'react-redux'
import Loader from './components/shared/Loader/Loader.jsx'
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh.js'


const Navigation = lazy(() => import('./components/shared/Navigation/Navigation.jsx')) 
const Home = lazy(() => import('./pages/Home/Home.jsx'))
const Authenticate = lazy(() => import('./pages/Auth/Authenticate.jsx'))
const Activate = lazy(() => import('./pages/Activate/Activate.jsx'))
const Rooms = lazy(() => import('./pages/Rooms/Rooms.jsx'))
const Room = lazy(() => import( './pages/Room/Room.jsx')) 
const NotFound = lazy(() => import('./pages/Not Found/NotFound.jsx'))



function App() {

      
        const {isAuth,user} = useSelector(state=>state.auth)

        const {loading} = useLoadingWithRefresh()


        return loading ? (
              <Loader mt='20rem'/>
        ): (
                <BrowserRouter>
                        <Navigation />
                        <Routes>
                                 <Route path="/" element={  <GuestRoute isAuth={isAuth} > <Home /> </GuestRoute>}>
                                 </Route>
                                
                                <Route path="/authenticate" element={  <GuestRoute isAuth={isAuth} > <Authenticate /> </GuestRoute>}>
                                </Route>

                               <Route path="/activate" element={  <SemiProtectedRoute isAuth={isAuth} user={user} > <Activate /> </SemiProtectedRoute>}      >
                               </Route>

                               <Route path="/rooms" element={  <ProtectedRoute isAuth={isAuth} user={user} > <Rooms /> </ProtectedRoute>}      >
                               </Route>

                                <Route path="/room/:roomId" element={  <ProtectedRoute isAuth={isAuth} user={user} > <Room /> </ProtectedRoute>}      >
                                </Route>
       
                        
                                <Route path="*" element={<NotFound />}/>
                        </Routes>
                </BrowserRouter>
        )
}


export default App