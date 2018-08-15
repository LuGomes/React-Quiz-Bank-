import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Questions from './Questions'
import TextField from '@material-ui/core/TextField';

class NewQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizTitle: ''
    }
  }

  handleCreateQuiz(){
    let quiz = {
      quizTitle: this.state.quizTitle,
      username:this.props.app.state.username};
    this.props.socket.emit('addQuiz', quiz , (resp) => {
      this.props.app.setState({
        mode: "questions",
        currQuizID: resp.currQuizID})
    })
  }

  render() {
    return (
      <div>
        <h1>This is the new quiz page</h1>
        <TextField type="text" label="Title" onChange={(e) => this.setState({quizTitle: e.target.value})}/><br/>
        <Button onClick={() => this.handleCreateQuiz()}>Add question</Button>
        <Button onClick={() => this.props.app.setState({mode: "dashboard"})}>Back to dashboard</Button>
    </div>
    );
  }
}

export default NewQuiz;
