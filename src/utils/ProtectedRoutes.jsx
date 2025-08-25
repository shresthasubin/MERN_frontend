import React from 'react'
import {Navigate} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoutes = ({children, allowedRoutes}) => {
    const userCookie = Cookies.get('user');
    console.log(userCookie)

    if (!userCookie) return <Navigate to='/' replace/>

    try {
        const user = JSON.parse(userCookie);
        if (allowedRoutes.includes(user.role)) {
            return children;
        } else {
            return <Navigate to='/' replace/>
        }
    } catch (err) {
        console.error('Invalid cookie', err);
        return <Navigate to='/' replace/>
    }

}

export default ProtectedRoutes
