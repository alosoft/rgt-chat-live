import './ChatBox.css';

import React, { Component } from 'react'
import ChatItem from '../ChatItem/ChatItem';
import { connect } from 'react-redux';
import chatSlice from '../../store/chatSlice';
import _ from 'lodash';

class ChatBox extends Component {

    constructor(props) {
        super(props);
        this.handleMessage = this.handleMessage.bind(this)
        this.props.socket.on('chat-message', this.handleMessage)
    }

    handleMessage(message) {
        const { addChat, chats, currentUser, selectedUser } = this.props;
        if (message.receiver !== (currentUser.user_id || currentUser.sub) && (selectedUser.user_id || selectedUser.sub) === message.sender)
            return;

        if (chats.length === 0) {
            addChat(message)
            return;
        }

        const exist = chats.filter(chat => chat.id === message.id);
        if (exist.length > 0)
            return;

        addChat(message)
    }

    render() {
        const { chats, currentUser } = this.props;
        return <>
            {_.uniqBy(chats, 'date').map(message => <ChatItem owner={message.sender === (currentUser.sub || currentUser.user_id)} key={message.id} chat={message} />)}
        </>
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addChat: (payload) => dispatch(chatSlice.actions.addChat(payload))
    }
}

const mapStateToProps = (state, ownProps) => {
    const currentUser = state.auth.currentUser;
    const selectedUser = state.chat.selectedUser;
    const currentUserId = currentUser.sub || currentUser.user_id;
    const currentSelectedUserId = selectedUser.sub || selectedUser.user_id;
    const room1 = `${currentUserId}-${currentSelectedUserId}`;
    const room2 = `${currentSelectedUserId}-${currentUserId}`;

    const chats = state.chat.rooms[room1] || state.chat.rooms[room2] || [];
    return {
        ...ownProps,
        chats,
        currentUser: state.auth.currentUser,
        selectedUser: state.chat.selectedUser
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);