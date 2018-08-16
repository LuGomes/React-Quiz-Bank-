import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
        <Button onClick={() => this.props.app.setState({mode: "dashboard"})}>Back to dashboard</Button>
      </div>
    );
  }
}

export default NewQuiz;
