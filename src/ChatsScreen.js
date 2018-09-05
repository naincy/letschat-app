import React, { Component } from 'react'
import Chatkit from '@pusher/chatkit'
import MessageList from './components/MessageList'
import TeamList from './components/TeamList'
import SendMessageForm from './components/SendMessageForm'
import TypingIndicator from './components/TypingIndicator'
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Lock from '@material-ui/icons/Lock';
import LockOpen from '@material-ui/icons/LockOpen';

class ChatScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: {},
            currentRoom: {},
            messages: [],
            usersWhoAreTyping: [],
            teamname: '',
            teamprivacy: false,
            currentUserTeams: {},
            currentRoomId: 15479319
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.sendTypingEvent = this.sendTypingEvent.bind(this)
        this.handlePrivacyChange = this.handlePrivacyChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.createTeam = this.createTeam.bind(this)
        this.chatManager = '';
    }
      
    handleChange(e) {
        this.setState({ teamname: e.target.value })
    }
    handlePrivacyChange(e, isChecked) {
        this.setState({ teamprivacy: isChecked })
    }
    createTeam(e) {
        if(e.keyCode === 13) {
            this.state.currentUser
                .createRoom({
                name: this.state.teamname,
                private: this.state.teamprivacy,
                addUserIds: []
            }).then(room => {
                this.setState({ teamname: '' })
            })
            .catch(err => {
                console.log(`Error creating room ${err}`)
            })
        }
    }
    sendTypingEvent() {
        this.state.currentUser
            .isTypingIn({ roomId: this.state.currentRoomId })
            .catch(error => console.error('error', error))
    }

    sendMessage(text) {
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoomId,
        })
    }

    chatMangerInit() {
        this.chatManager = new Chatkit.ChatManager({
            instanceLocator: 'v1:us1:58197bf3-cd05-4562-ab6d-371e117fa29b',
            userId: this.props.currentUsername,
            tokenProvider: new Chatkit.TokenProvider({
                url: 'http://localhost:3001/authenticate',
            }),
        })
    }
    chatManagerLoad(roomId) {
        this.chatManager
            .connect()
            .then(currentUser => {
                this.setState({ currentUser })
                this.setState({ currentUserTeams: currentUser.rooms })
                return currentUser.subscribeToRoom({
                    roomId: roomId,
                    messageLimit: 100,
                    hooks: {
                        onNewMessage: message => {
                            this.setState({
                                messages: [...this.state.messages, message],
                            })
                        },
                        onUserStartedTyping: user => {
                            this.setState({
                                usersWhoAreTyping: [...this.state.usersWhoAreTyping, user.name],
                            })
                        },
                        onUserStoppedTyping: user => {
                            this.setState({
                                usersWhoAreTyping: this.state.usersWhoAreTyping.filter(
                                    username => username !== user.name
                                ),
                            })
                        },
                    },
                })
            })
            .then(currentRoom => {
                this.setState({ currentRoom })
            })
            .catch(error => console.error('error', error))
    }

    componentDidMount() {
        this.chatMangerInit();
        this.chatManagerLoad(this.state.currentRoomId);
    }

    onTeamChange(id) {
        var _self = this;
        const newRoom = this.state.currentUserTeams.filter(function (el) { return el.id === id; });
        this.setState({currentRoomId : id});
        this.chatManager
            .connect()
            .then(currentUser => {
                this.setState({ currentUser })
                this.setState({ currentUserTeams: currentUser.rooms })
                return currentUser.fetchMessages({
                    roomId: id,
                }).then(messages => {
                    this.setState({
                        messages: messages,
                    });
                    _self.setState({currentRoom : newRoom});
                  })
                  .catch(err => {
                    console.log(`Error fetching messages: ${err}`)
                  })
            })
            .catch(error => console.error('error', error))
    }
    render() {

        const styles = {
            container: {
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }, 
            chatContainer: {
                display: 'flex',
                flex: 1,
            },
            whosOnlineListContainer: {
                width: '300px',
                flex: 'none',
                padding: 20,
                backgroundColor: 'darkcyan',
                color: 'white',
                h2Title: {
                    marginBottom: '10px'
                },
                textField: {
                    marginBottom: '10px'
                }
            },
            chatListContainer: {
                padding: '20px 0 0 20px',
                width: '85%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'lightgray',
                h2Title: {
                    marginBottom: '10px',
                    backgroundColor: 'darkgray',
                },
            },
        }
        return (
            <div style={styles.container}>
                <div style={styles.chatContainer}>
                    <aside style={styles.whosOnlineListContainer}>
                        <h2 style={styles.whosOnlineListContainer.h2Title}>Capsule ChatKit</h2>
                        <FormControl>
                            <Input placeholder="Create Team"   
                            value={this.state.teamname}
                            onKeyDown={this.createTeam}
                            onChange={this.handleChange} />
                        </FormControl>
                        <FormControlLabel control={
                            <Checkbox icon={<LockOpen />} checkedIcon={<Lock />}  onChange={this.handlePrivacyChange} value="checkedH" />} />
                            <h4 style={styles.whosOnlineListContainer.h2Title}>Teams</h4>
                            { this.state.currentUserTeams.length > 0 ? 
                                <TeamList userTeams={this.state.currentUserTeams} onTeamChange={this.onTeamChange.bind(this)} />
                                : ''}                            
                    </aside>
                    <section style={styles.chatListContainer}>
                        <h2 style={styles.chatListContainer.h2Title}>{this.state.currentRoom.name}</h2>
                        <MessageList
                            messages={this.state.messages}
                            style={styles.chatList}
                        />
                        <TypingIndicator usersWhoAreTyping={this.state.usersWhoAreTyping} />
                        <SendMessageForm
                            onSubmit={this.sendMessage}
                            onChange={this.sendTypingEvent}
                        />
                    </section>
                </div>
            </div>
        )

    }
}

export default ChatScreen