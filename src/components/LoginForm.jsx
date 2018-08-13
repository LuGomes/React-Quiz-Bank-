import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  handleLogin() {
    let {username, password} = this.state;
    this.props.socket.emit('login', {username: username, password: password}, (data) => {
      if(data.user) this.props.app.setState({username: data.user.username, password: data.user.password, isLoggedIn: true, mode: ''});
      else console.log(data.err);
    });
  }

  render() {
    return (
      <div>
        <TextField type="text" label="Username" onChange={(e) => this.setState({username: e.target.value})}/><br/>
        <TextField type="password" label="Password" onChange={(e) => this.setState({password: e.target.value})}/><br/>
        <Button onClick={() => this.handleLogin()}>Login</Button><br/>
        <a href="#">Don't have an account yet?</a>
      </div>
    );
  }
}

export default LoginForm;
