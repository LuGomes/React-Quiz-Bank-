import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper'

class NewQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizTitle: ''
    }
  }

  handleCreateQuiz() {
    let quiz = {title: this.state.quizTitle, user: this.props.app.state.user};
    this.props.app.socket.emit('createQuiz', quiz , (newQuiz) => {
      this.props.app.setState({mode: "questions", currQuiz: newQuiz})});
  }

  render() {
    return (
      <div>
        <TextField type="text" label="Title" onChange={(e) => this.setState({quizTitle: e.target.value})}/><br/>
        <Button onClick={() => this.handleCreateQuiz()}>Add questions</Button><br/>
        <Button onClick={() => this.props.app.setState({mode: "teacherDashboard"})}>Back to dashboard</Button>
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
  variant: "contained",
  fontFamily: "Segoe UI",
  backgroundColor: "#ffd3b5",
  margin: 10,
}

export default NewQuiz;
