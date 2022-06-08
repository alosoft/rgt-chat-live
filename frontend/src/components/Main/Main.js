import React, { Component } from 'react';
import { connect } from 'react-redux';
import chatSlice from '../../store/chatSlice';
import ChatBox from '../ChatBox/ChatBox';
import CircularProgressBar from '../CircularProgressBar/CircularProgressBar';
import Input from '../Input/Input';
import ProgressBar from '../ProgressBar/ProgressBar';
import UserCard from '../UserCard/UserCard';
import './Main.css';

class Main extends Component {

    render() {
        const { selectedUser, socket, saving, loading, checkBlockedChat, blockedMe } = this.props
        console.log('socket=>', socket)
        console.log('selected user', selectedUser)
        blockedMe.forEach(id => {
            if (selectedUser) {
                const user_id = selectedUser.user_id || selectedUser.sub;
                if (user_id === id)
                    checkBlockedChat(user_id)
            }
        });

        return (
            <div className='main'>
                <div className="main__header">
                    {selectedUser ?
                        <UserCard profile={true} user={selectedUser} />
                        : null}
                </div>
                <div className="main__chat">
                    {
                        loading ? <CircularProgressBar /> :
                            selectedUser ?
                                <ChatBox socket={socket} />
                                : <div className='main__instruction'>
                                    <p>Select a user on the left to start</p>
                                </div>
                    }
                </div>
                {saving ?
                    <ProgressBar />
                    : null}
                <div className="main__input">
                    <Input socket={socket} />
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        checkBlockedChat: (user) => dispatch(chatSlice.actions.blockedChat(user))
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        saving: state.chat.saving,
        loading: state.chat.loading,
        blockedMe: state.auth.blockedMe,
        selectedUser: Object.keys(state.chat.selectedUser).length === 0 ? null : state.chat.selectedUser
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);