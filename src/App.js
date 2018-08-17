import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import logo from './logo.svg';
import './App.css';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import NewQuiz from './components/NewQuiz';
import Questions from './components/Questions';
import io from 'socket.io-client';
import styles from './components/styles';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
    this.socket = io('http://localhost:3001');
    // this.socket.on('connect', function(){console.log('ws connect')});
    // this.socket.on('disconnect', function(){console.log('ws disconnect')});
  }

  render() {
    let screen;
    if(this.state.mode === "login") screen = <LoginForm app={this}/>
    else if(this.state.mode === "registration") screen = <RegistrationForm app={this}/>
    else if(this.state.mode === "teacherDashboard") screen = <TeacherDashboard app={this}/>
    else if(this.state.mode === "studentDashboard") screen = <StudentDashboard app={this}/>
    else if(this.state.mode === "newQuiz") screen = <NewQuiz app={this}/>
    else if(this.state.mode === "questions") screen = <Questions app={this}/>
    else  screen =
    <div>

      <header className="App-header">
        <img style={{height: 200}} src='https://steamusercontent-a.akamaihd.net/ugc/933804400183701240/95E1ABA88A0955C3C53F8BD672B361D75C370B6E/' alt="logo" />
        <h1 className="App-title">Welcome to React Quiz</h1>
      </header>

      <p>Create a quiz that engages students, generates leads or promotes your brand.</p>
      <Button style={styles.btnForDefaultPage}
              onClick={() => this.setState({mode: 'login'})}>Login</Button>
      <Button style={styles.btnForDefaultPage}
              onClick={() => this.setState({mode: 'registration'})}>Register</Button>
    </div>
    return (
      <div className="App">
        {screen}
      </div>
    );
  }
}


export default App;
