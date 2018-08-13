import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import io from 'socket.io-client';
import Button from '@material-ui/core/Button';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      mode: 'initial',
      isLoggedIn: false
    };
    this.socket = io('http://localhost:3001');
    this.socket.on('connect', function(){console.log('ws connect')});
    this.socket.on('disconnect', function(){console.log('ws disconnect')});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React Quiz</h1>
        </header>
        {this.state.mode === "initial" ?
        <div>
          <Button onClick={() => this.setState({mode: 'login'})}>Login</Button>
          <Button onClick={() => this.setState({mode: 'registration'})}>Register</Button>
        </div> :
        null}

        {this.state.mode === "login" ?
        <LoginForm app={this} socket={this.socket}/> :
        (this.state.mode === "registration" ? <RegistrationForm app={this} socket={this.socket}/> :
        (this.state.isLoggedIn ? "Will display the dashboard component here" : null))
        }
      </div>
    );
  }
}

export default App;
