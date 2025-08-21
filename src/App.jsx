import React, { lazy } from 'react'
import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router"

const Navigation = lazy(() => import('./components/shared/Navigation/Navigation.jsx')) 
const Home = lazy(() => import('./pages/Home/Home.jsx'))
const Register = lazy(() => import('./pages/Register/Register.jsx'))
const Login = lazy(() => import('./pages/Login/Login.jsx'))
const NotFound = lazy(() => import('./pages/Not Found/NotFound.jsx'))

function App() {
        return (
                <BrowserRouter>
                        <Navigation />
                        <Routes>
                                <Route path="/" element={<Home />}/>
                                <Route path="/register" element={<Register />}/>
                                <Route path="/login" element={<Login />}/>
                                <Route path="*" element={<NotFound />}/>
                        </Routes>
                </BrowserRouter>
        )
}

export default App