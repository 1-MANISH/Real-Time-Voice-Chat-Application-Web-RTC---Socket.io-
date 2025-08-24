import React from 'react'
import { Navigate } from 'react-router'

function ProtectedRoute({
            children,
        ...rest
}) {
        let {isAuth,user} = rest

        if(!isAuth){
                return <Navigate to='/authenticate' replace />
        }
        if(isAuth && !user?.activated){
                return <Navigate to='/activate' replace />
        }
        return children
        
}

export default ProtectedRoute