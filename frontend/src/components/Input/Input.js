import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Input.css';
import uuid from 'react-uuid';
import chatSlice, {storeChat} from '../../store/chatSlice';



const Input = ({ socket }) => {
    const selectedUser = useSelector(state => state.chat.selectedUser);
    const currentUser = useSelector(state => state.auth.currentUser);
    const blockedMe = useSelector(state => state.auth.blocked);
    const dispatch = useDispatch();
    // const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const selectedUserId = selectedUser.sub || selectedUser.user_id;
    const blocked = blockedMe.filter(id => selectedUserId === id).length > 0;

    useEffect(() => {
        if (Object.keys(currentUser).length === 0) {
            navigate('/')
        }
    }, [currentUser])


    const handleSubmit = (event) => {
        event.preventDefault();
        const message = event.target[0].value;
        if (message.replaceAll('', '').length === 0)
            return;
        const msg = {
            id: uuid(),
            message,
            date: new Date().getTime(),
            sender: currentUser.user_id || currentUser.sub,
            receiver: selectedUser.user_id || selectedUser.sub
        };
        console.log('new message', msg)
        // dispatch(chatSlice.actions.addChat(msg))
        dispatch(storeChat(msg))
        socket.emit('send-chat-message', msg);
        event.target[0].value = ''
        
        // setMessage('')
    }

    return <form className="form" onSubmit={handleSubmit}>
        <input disabled={Object.keys(selectedUser).length === 0 || blocked} type="text" placeholder='Type a message' className="form__input" />
        <button disabled={Object.keys(selectedUser).length === 0 || blocked} type='submit' className="form__submit">Send</button>
    </form>
}

export default Input;
