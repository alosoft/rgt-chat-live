import React, { Component } from 'react'
import { connect, useSelector } from 'react-redux';
import './CurrentUser.css';
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom';

const CurrentUser = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const { logout, loginWithRedirect } = useAuth0();
    const navigate = useNavigate();
    return (
        <div className='currentuser'>
            <div className="currentuser-img">
                <img src={currentUser.picture} alt="" />
            </div>
            <p className="currentuser-name">{currentUser.name}</p>
            <button className="currentuser-logout"
                onClick={() => {
                    navigate('/');
                    logout();
                }}>Logout</button>
        </div>
    )
}

export default CurrentUser;
