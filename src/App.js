import React, { Component } from 'react'
import UsernameForm from './components/UsernameForm'
import ChatScreen from './ChatsScreen'

class App extends Component {
  constructor() {
    super()
    this.state = {
      currentUsername: '',
      currentScreen: 'WhatIsYourUsernameScreen'
    }
    this.onUsernameSubmitted = this.onUsernameSubmitted.bind(this)
    this.onUserLogout = this.onUserLogout.bind(this)
  }

  onUserLogout() {
    console.log('logout');
    this.setState({
      currentUsername: '',
      currentScreen: 'WhatIsYourUsernameScreen'
    })
  }

  onUsernameSubmitted(username) {
    fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
      .then(response => {
        this.setState({
          currentUsername: username,
          currentScreen: 'ChatScreen'
        })
      })
      .catch(error => console.error('error', error))
  }

  render() {
    if (this.state.currentScreen === 'WhatIsYourUsernameScreen') {
      return <UsernameForm onSubmit={this.onUsernameSubmitted} />
    }
   if (this.state.currentScreen === 'ChatScreen') {
     return <ChatScreen currentUsername={this.state.currentUsername} onLogout={this.onUserLogout} />
   }
  }
}

export default App
