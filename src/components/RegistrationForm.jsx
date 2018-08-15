import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
      <div>
        <TextField type="text" label="Username" onChange={(e) => this.setState({username: e.target.value})}/><br/>
        <TextField type="password" label="Password" onChange={(e) => this.setState({password: e.target.value})}/><br/>
        <Button onClick={() => this.setState({userType: "student"})}>I'm a student</Button>
        <Button onClick={() => this.setState({userType: "teacher"})}>I'm a teacher</Button>
        <Button onClick={() => this.handleRegistration()}>Register</Button><br/>
        {/* <a href="#">Already have an account?</a> */}
      </div>
    );
  }
}

export default RegistrationForm;
