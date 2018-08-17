import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import styles from './styles';

class NewQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      correctOption: '',
      questionsArr: [],
      optionsArr: [],
      correctOptionsArr: []
    }
  }

  handleQuestionAddition(cb) {
    let {question, optionA, optionB, optionC, correctOption} = this.state;
    let currQuestions = this.state.questionsArr.slice();
    currQuestions.push(question);
    let currOptions = this.state.optionsArr.slice();
    currOptions.push([optionA, optionB, optionC]);
    let currCorrectOptions = this.state.correctOptionsArr.slice();
    currCorrectOptions.push(correctOption);
    this.setState({
      questionsArr: currQuestions,
      optionsArr: currOptions,
      correctOptionsArr: currCorrectOptions,
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      correctOption: ''}, cb);
  }

  handleCompleteQuiz() {
   if(this.state.question) this.handleQuestionAddition(() => {
     this.props.app.socket.emit('addCompleteQuiz', {
       questions: this.state.questionsArr,
       options: this.state.optionsArr,
       correctOptions: this.state.correctOptionsArr,
       currQuiz: this.props.app.state.currQuiz});
     this.props.app.setState({mode: "teacherDashboard"});
   });
 }

 handleIncompleteQuiz() {
   if(this.state.question) this.handleQuestionAddition(() => {
     this.props.app.socket.emit('addIncompleteQuiz', {
       questions: this.state.questionsArr,
       options: this.state.optionsArr,
       correctOptions: this.state.correctOptionsArr,
       currQuiz: this.props.app.state.currQuiz});
     this.props.app.setState({mode: "teacherDashboard"});
   });
 }

  backToDashboard() {
    this.props.app.setState({mode: 'teacherDashboard'});
  }

  render() {
    return (
      <div style={center}>
        <Paper elevation={2} style={{padding: 30}}>
        <TextField style={{width: "100%"}} type="text" label="Enter question" value={this.state.question} onChange={(e) => this.setState({question: e.target.value})}/><br/>
        <TextField type="text" label="Option a." value={this.state.optionA} onChange={(e) => this.setState({optionA: e.target.value})}/><br/>
        <TextField type="text" label="Choice b." value={this.state.optionB} onChange={(e) => this.setState({optionB: e.target.value})}/><br/>
        <TextField type="text" label="Choice c." value={this.state.optionC} onChange={(e) => this.setState({optionC: e.target.value})}/><br/>
        <TextField style={{width: "100%"}} type="text" label="Correct choice: a, b or c?" value={this.state.correctOption} onChange={(e) => this.setState({correctOption: e.target.value})}/><br/>

        <Button style={styles.btn} onClick={() => this.handleQuestionAddition()}>Add this question</Button><br/>
        <Button style={styles.btn} onClick={() => this.handleCompleteQuiz()}>Save question and finish quiz</Button><br/>
        <Button style={styles.btn} onClick={() => this.handleIncompleteQuiz()}>Save question and exit</Button><br/>
        <Button style={styles.btn} onClick={() => this.backToDashboard()}>Back to Dashboard</Button>
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

export default NewQuiz;
