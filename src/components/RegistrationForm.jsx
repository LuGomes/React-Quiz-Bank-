import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper'
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
    this.props.app.socket.emit('registration', {username: username, password: password, userType: userType}, (data) => {
      let mode = data.user.userType === "student" ? "studentDashboard" : "teacherDashboard";
      this.props.app.setState({
        user: data.user,
        mode: mode});
    });
  }

  render() {
    return (
      <div style={center}>
        <Paper elevation={2} style={{padding: 30}}>
            <TextField type="text" label="Username"
              onChange={(e) => this.setState({username: e.target.value})}/><br/>
            <TextField type="password" label="Password"
              onChange={(e) => this.setState({password: e.target.value})}/><br/>
            <Button style={{...btn, backgroundColor: "#ffaaa6" }}
              onClick={() => this.setState({userType: "student"})}>I'm a student</Button><br/>
            <Button style={{...btn, backgroundColor: "#a8e6ce" }}
              onClick={() => this.setState({userType: "teacher"})}>I'm a teacher</Button><br/>
            <Button style={btn} onClick={() => this.handleRegistration()}>Register</Button><br/><br/>
            <a onClick={() => this.props.app.setState({mode: "login"})}>Already have an account?</a>
      </Paper>
      </div>
    );
  }
}

const center = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  height: "100%",
  background: "linear-gradient(90deg, #a8e6ce, #ffd3b5)"
}
const btn = {
  fontFamily: "Segoe UI",
  backgroundColor: "#ffd3b5",
  margin: 10,
}

export default RegistrationForm;
