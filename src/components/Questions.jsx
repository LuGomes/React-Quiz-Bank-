import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class NewQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      questionsArr: [],
      optionsArr: [],
      correctOptionsArr: [],
      optionA: '',
      optionB: '',
      optionC: '',
      correctOption: ''
    }
  }

  handleQuestionAddition() {
    let {question, optionA, optionB, optionC, correctOption} = this.state;
    let currQuestions = this.state.questionsArr.slice();
    currQuestions = currQuestions.concat([question]);
    let currOptions = this.state.optionsArr.slice();
    currOptions = currOptions.concat([[optionA, optionB, optionC]]);
    let currCorrectOptions = this.state.correctOptionsArr.slice();
    currCorrectOptions = currCorrectOptions.concat([correctOption]);
    this.setState({
      questionsArr: currQuestions,
      optionsArr: currOptions,
      correctOptionsArr: currCorrectOptions,
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      correctOption: ''});
  }

  handleQuizComplete() {
    this.props.socket.emit('addQuestion', {
      questions: this.state.questionsArr,
      options: this.state.optionsArr,
      correctOptions: this.state.correctOptionsArr,
      currQuizID: this.props.app.state.currQuizID}, (resp) => {
        console.log(resp.message);
      });
    this.props.app.setState({mode: "teacherDashboard"});
  }

  backToDashboard() {
    this.props.app.setState({mode: 'teacherDashboard'});
  }

  render() {
    return (
      <div>
        <TextField type="text" label="Enter question" value={this.state.question} onChange={(e) => this.setState({question: e.target.value})}/><br/>
        <TextField type="text" label="Option a." value={this.state.optionA} onChange={(e) => this.setState({optionA: e.target.value})}/><br/>

        <TextField type="text" label="Option b." value={this.state.optionB} onChange={(e) => this.setState({optionB: e.target.value})}/><br/>

        <TextField type="text" label="Option c." value={this.state.optionC} onChange={(e) => this.setState({optionC: e.target.value})}/><br/>

        <TextField type="text" label="correct Option: a, b or c?" value={this.state.correctOption} onChange={(e) => this.setState({correctOption: e.target.value})}/><br/>

        <Button onClick={() => this.handleQuestionAddition()}>Add this question</Button>
        <Button onClick={() => this.handleQuizComplete()}>Finish quiz</Button>
        <Button onClick={() => this.backToDashboard()}>Back to Dashboard</Button>

    </div>
    );
  }
}

export default NewQuiz;
