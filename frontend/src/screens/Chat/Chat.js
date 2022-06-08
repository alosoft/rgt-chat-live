import React, { Component } from 'react'
import { connect } from 'react-redux';
import Layout from '../../components/Layout/Layout';
import LeftPane from '../../components/LeftPane/LeftPane';
import Main from '../../components/Main/Main';
import io from 'socket.io-client';
import { setSelectedUser } from '../../store/chatSlice';
import CurrentUser from '../../components/CurrentUser/CurrentUser';
import { Auth0Provider, useAuth0, User } from "@auth0/auth0-react";
import config from '../../utils/config';
import authSlice, { fetchBlocked, fetchBlockers } from '../../store/authSlice';


class Chat extends Component {

    constructor(props) {
        super(props);
        const { currentUser } = this.props;
        const production = process.env.NODE_ENV === 'production';
        const port = process.env.PORT || '5000';
        const url = production ? window.location.origin : `${window.location.hostname}:${port}`
        this.socket = io(url, {
            query: {
                ...currentUser
            }
        });
        this.socket.on('message-send', data => {
        })
        this.socket.on('disconnect', data => {
        })
        this.socket.on('user-settings', data => {
            this.props.fetchBlockers(currentUser)
        })
    }

    render() {
        const onRedirectCallback = (appState) => {
        };

        const { currentUser, selectedUser, setSelectedUser, fetchBlocked, notify, disableNotify, fetchBlockers } = this.props;
        fetchBlocked(currentUser);
        fetchBlockers();
        if (selectedUser) {
            setSelectedUser(selectedUser)
        }

        if (notify) {
            this.socket.emit('user-blocked');
            disableNotify()
        }

        return (
            <Auth0Provider
                domain={config}
                clientId={config.clientId}
                redirectUri={window.location.origin}
                onRedirectCallback={onRedirectCallback}
            >
                <Layout>
                    <LeftPane socket={this.socket} />
                    <div>
                        <CurrentUser />
                        <Main socket={this.socket} />
                    </div>
                </Layout>
            </Auth0Provider>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedUser: (user) => dispatch(setSelectedUser(user)),
        fetchBlocked: (user) => dispatch(fetchBlocked(user)),
        fetchBlockers: () => dispatch(fetchBlockers('')),
        disableNotify: () => dispatch(authSlice.actions.removeNotify())
    }
}

const mapStateToProps = (state, props) => {
    return {
        currentUser: state.auth.currentUser,
        selectedUser: state.chat.selectedUser,
        notify: state.auth.notify,
        ...props
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);