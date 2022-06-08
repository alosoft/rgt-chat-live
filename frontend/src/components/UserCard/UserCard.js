import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './UserCard.css';
import chatSlice, { setSelectedUser } from '../../store/chatSlice'
import { blockUser } from '../../store/authSlice';

const UserCard = ({ user, profile }) => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.auth.loading)
    const blockedUserIds = useSelector(state => state.auth.blocked)

    const userId = user.sub || user.user_id;
    const blocked = blockedUserIds.filter(item => item === userId).length > 0;

    function handleBlock() {
        dispatch(blockUser({
            user,
            blocked
        }))
    }


    return <div className='usercard' onClick={() => dispatch(setSelectedUser(user))}>
        <div className="usercard__img">
            <img src={user.picture} alt="user" />
        </div>
        <div className="usercard__profile">
            <p className="usercard__profile-name">{user.name}</p>
        </div>
        {
            profile ?
                null
                :
                <button disabled={loading} className="usercard__block" onClick={handleBlock}>
                    {loading ? 'Saving....' : blocked ? 'Unblock' : 'Block'}
                </button>
        }
    </div>
}

export default UserCard
