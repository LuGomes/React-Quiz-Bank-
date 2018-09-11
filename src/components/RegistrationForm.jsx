import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField';
import styles from './styles';

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      userType: '',
      buttonPressed: false
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
  testFunction(e){
    this.setState({userType: "student", buttonPressed: true});
    // e.target.style.backgroundColor = "yellow";

    // someVar.backgroundColor = "yellow";
    // console.log(e.target.somVar);

    // console.log("target.style", e.target.style);
  }

  render() {
    
    return (
      <div style={center}>
        <Paper elevation={2} style={{padding: 30}}>
            <TextField type="text" label="Username"
              onChange={(e) => this.setState({username: e.target.value})}/><br/>
            <TextField type="password" label="Password"
              onChange={(e) => this.setState({password: e.target.value})}/><br/>
            <Button style={this.state.buttonPressed? someVar2 : someVar}
              onClick={(e) => this.testFunction(e)}>I'm a student</Button><br/>
            <Button style={{...styles.btn, backgroundColor: "#a8e6ce" }}
              onClick={() => this.setState({userType: "teacher"})}>I'm a teacher</Button><br/>
            <Button style={styles.btn} onClick={() => this.handleRegistration()}>Register</Button><br/><br/>
            <a onClick={() => this.props.app.setState({mode: "login"})}>Already have an account?</a>
      </Paper>
      </div>
    );
  }
}
// document.getElementByClassName("btn").style.backgroundColor = "yellow";

const center = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  height: "100%",
  background: "rgb(33,49,90)",
}
const someVar= {
  variant: "contained",
  fontFamily: "Arial",
  margin: 5,
  backgroundColor:  "red",
}
const someVar2= {
  variant: "contained",
  fontFamily: "Arial",
  margin: 5,
  backgroundColor:  "yellow",
}


export default RegistrationForm;
