import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  handleLogin() {
    let {username, password} = this.state;
    this.props.socket.emit('login', {username: username, password: password}, (data) => {
      if(!data.err) {
        if(data.user) {
          //user found
          let mode = data.user.userType === "student" ? 'studentDashboard' : 'teacherDashboard';
          this.props.app.setState({username: data.user.username, password: data.user.password, mode: mode});
        } else {
          //there is no user with that login
          alert("Invalid username or password");
          this.setState({username: '', password: ''});
        }
      } else {
        // server error
        alert ("Could not lookup mongoDB");
      }
    });
  }

  render() {
    return (
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20}}>
        <Paper elevation={2}>
          <AppBar position="static" color="secondary">
            <Toolbar>
            </Toolbar>
          </AppBar>
          <div style={{padding: 20}}>
            <TextField type="text" label="Username" value={this.state.username} onChange={(e) => this.setState({username: e.target.value})}/><br/>
            <TextField type="password" label="Password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/><br/>
            <Button onClick={() => this.handleLogin()}>Login</Button><br/>
            <Button onClick={() => this.props.app.setState({mode: "registration"})}>Don't have an account yet?</Button><br/>
          </div>
      </Paper>
      </div>
    );
  }
}

export default LoginForm;
