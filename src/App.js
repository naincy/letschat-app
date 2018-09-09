import React, { Component } from 'react'
import PropTypes from 'prop-types'
import UsernameForm from './components/UsernameForm'
import ChatScreen from './ChatsScreen'
import {connect} from 'react-redux'

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    screen: PropTypes.string,
  };

  constructor(props) {
    super(props)
    this.state = {
      currentUsername: ''
    }
    this.onUsernameSubmitted = this.onUsernameSubmitted.bind(this)
    this.onUserLogout = this.onUserLogout.bind(this)
  }

  onUsernameSubmitted(username) {
    this.props.dispatch({
      type: 'GET_USERNAME',
      username
    });
  }

  onUserLogout() {
    this.props.dispatch({
      type: 'LOGOUT_USER'
    });
  }

  render() {
    const screen_ = this.props.screen || 'WhatIsYourUsernameScreen'
    const username_ = this.props.currentUsername || '';
    if (screen_ === 'WhatIsYourUsernameScreen') {
      return <UsernameForm onSubmit={this.onUsernameSubmitted} />
    }
    if (screen_ === 'ChatScreen') {
      return <ChatScreen currentUsername={username_} onLogout={this.onUserLogout} />
    }
  }
}

const mapStateToProps = (state) => ({
  screen: state.screen,
  currentUsername : state.username
});

export default connect(mapStateToProps) (App)
