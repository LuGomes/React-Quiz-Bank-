import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      userType: ''
    }
  }

  handleRegistration() {
    let {username, password, userType} = this.state;
    this.props.socket.emit('registration', {username: username, password: password, userType: userType}, (data) => {
      this.props.app.setState({username: data.user.username, password: data.user.password, isLoggedIn: true, mode: ''});
    });
  }

  render() {
    return (
      // <div>
      //   <TextField type="text" label="Username" onChange={(e) => this.setState({username: e.target.value})}/><br/>
      //   <TextField type="password" label="Password" onChange={(e) => this.setState({password: e.target.value})}/><br/>
      //   <Button onClick={() => this.setState({userType: "student"})}>I'm a student</Button><br/>
      //   <Button onClick={() => this.setState({userType: "teacher"})}>I'm a teacher</Button><br/>
      //   <Button onClick={() => this.handleRegistration()}>Register</Button><br/><br/>
      //   <Button onClick={() => this.props.app.setState({mode: "login"})}>Already have an account?</Button>
      // </div>


      <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20}}>
        <Paper elevation={2}>
          <AppBar position="static" color="primary">
            <Toolbar>
            </Toolbar>
          </AppBar>
          <div style={{padding: 20}}>
            <TextField type="text" label="Username" onChange={(e) => this.setState({username: e.target.value})}/><br/>
            <TextField type="password" label="Password" onChange={(e) => this.setState({password: e.target.value})}/><br/>
            <Button onClick={() => this.setState({userType: "student"})}>I'm a student</Button><br/>
            <Button onClick={() => this.setState({userType: "teacher"})}>I'm a teacher</Button><br/>
            <Button onClick={() => this.handleRegistration()}>Register</Button><br/><br/>
            <Button onClick={() => this.props.app.setState({mode: "login"})}>Already have an account?</Button>
          </div>
      </Paper>
      </div>

    );
  }
}

export default RegistrationForm;
