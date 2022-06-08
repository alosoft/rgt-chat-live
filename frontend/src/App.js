import './App.css';
import { Auth0Provider, useAuth0, User} from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import Login from './screens/Login/Login';
import config from './utils/config';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUser } from './store/actions'
import PropTypes from 'prop-types';

class App extends Component {
  
  render() {

    const onRedirectCallback = (appState) => {
    };

    return <Auth0Provider
      domain={config.domain}
      clientId={config.clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <Login />
    </Auth0Provider>
  }
}

App.propTypes = {
  setUser: PropTypes.func
}


export default connect((state, props) => {
  return {}
}, {
  setUser
})(App);
