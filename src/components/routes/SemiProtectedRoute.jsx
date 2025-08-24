import React from 'react'
import { Navigate } from 'react-router'
function SemiProtectedRoute({
            children,
        ...rest
}) {
        let {isAuth,user} = rest

        if(!isAuth){
                return <Navigate to='/authenticate' replace />
        }
        if(isAuth && user?.activated){
                return <Navigate to='/rooms' replace />
        }
        return children
        
}

export default SemiProtectedRoute