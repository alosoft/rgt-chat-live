import React, { useEffect } from 'react';
import './Login.css'
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react'
import authSlice from '../../store/authSlice';
import { useDispatch } from 'react-redux';
import CircularProgressBar from '../../components/CircularProgressBar/CircularProgressBar';

function Login() {
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
    console.log('user account=-==========>', user)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authSlice.actions.setUser(user))
        if (isAuthenticated) {
            navigate('/chat')
        }
    }, [user])

    return (
        <div className='login'>
            <h1 className="login__welcome">Welcome to Live Chat</h1>
            {isLoading ?
                <div className='login__progress'>
                    <CircularProgressBar />
                </div>
                : null}
            <button onClick={() => loginWithRedirect()} className="login__button" disabled={isAuthenticated}>Login</button>
            {/* <button onClick={() => logout({ returnTo: window.location.origin })} className="login__button"> Logout</button> */}
        </div>
    )
}

export default Login