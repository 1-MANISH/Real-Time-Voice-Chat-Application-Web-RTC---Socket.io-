import React from 'react'
import { Navigate } from 'react-router'

function GuestRoute({
        children,
        ...rest
}) {
        let {isAuth} =rest

        if(isAuth){
                return <Navigate to='/rooms' replace />
        }

        return children
}

export default GuestRoute