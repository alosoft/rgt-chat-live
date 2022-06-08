import React from 'react';
import './ChatItem.css';
import moment from 'moment';

const ChatItem = ({ chat, owner }) => {
    function formatDate(date) {
        return moment(new Date(date)).format('MMMM Do, h:mm a');
    }
    return <div style={{
        alignSelf: owner ? 'flex-end' : 'flex-start'
    }} className='chat__box-item'>
        <div style={{
            display: 'flex',
            flexDirection: 'flex-column',
            alignItems: owner ? 'flex-end' : 'flex-start'
        }}  className='chat__item'>
            <p className="chat__item-content">{chat.message}</p>
        </div>
        <p>{formatDate(chat.date)}</p>
    </div>
}

export default ChatItem;