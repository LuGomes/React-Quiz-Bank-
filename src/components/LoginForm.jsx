import React, { Component} from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import styles from './styles';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      invalidLogin: false
    }
  }

  handleLogin() {
    let {username, password} = this.state;
    this.props.app.socket.emit('login', {username: username, password: password}, (data) => {
      if(!data.err) {
        if(data.user) {
          let mode = data.user.userType === "student" ? "studentDashboard" : "teacherDashboard";
          this.props.app.setState({user: data.user, mode: mode});
        } else {
          this.setState({username: '', password: '', invalidLogin: true});
        }
      } else {
        alert("Server error on login");
      }
    });
  }

  render() {
    return (
      <div style={center}>
        <Paper elevation={2} style={{padding: 30, fontFamily: "Courier New"}}>
          <TextField type="text" label="Username" value={this.state.username}
            onChange={(e) => this.setState({username: e.target.value})}/><br/>
          <TextField type="password" label="Password" value={this.state.password}
            onChange={(e) => this.setState({password: e.target.value})}/><br/>
          <Button style={styles.btn} onClick={() => this.handleLogin()}>Login</Button><br/>
          <Button style={styles.btn} onClick={() => this.props.app.setState({mode: "registration"})}>Don't have an account yet?</Button><br/>
          {this.state.invalidLogin ?
            <div style={{color: "#D47474", margin: 10}}>Your login isn't right. Try again.</div> :
          null}
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
  background: "rgb(33,49,90)",
}




export default LoginForm;
