import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class NewQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      correctOption: ''
    }
  }

  handleQuestionAddition() {
    let {question, options} = this.state;
    this.props.socket.emit('addQuestion', {question: question, options: options}, (resp) => {
      console.log("came back to frontend");
    });
    this.setState({question: '', optionA: '', optionB: '', optionC: '', correctOption: ''});
  }

  handleQuizComplete() {

    // this.setState({question: '', options: []});
    this.props.app.setState({mode: "dashboard"});
  }

  // addOption() {
  //   let optionsArr = this.state.options.slice();
  //   this.setState({options: optionsArr.concat(this.state.optionStorage)}, () => console.log(this.state.options));
  // }

  render() {
    return (
      <div>
        <h1>This is a new question</h1>
        <TextField type="text" label="Enter question" value={this.state.question} onChange={(e) => this.setState({question: e.target.value})}/><br/>
        <TextField type="text" label="Option a." value={this.state.optionA} onChange={(e) => this.setState({optionA: e.target.value})}/><br/>
          {/* <Button onClick={() => this.addOption()}>Enter question</Button><br/> */}
        <TextField type="text" label="Option b." value={this.state.optionB} onChange={(e) => this.setState({optionB: e.target.value})}/><br/>
          {/* <Button onClick={() => this.addOption()}>Enter question</Button><br/> */}
        <TextField type="text" label="Option c." value={this.state.optionC} onChange={(e) => this.setState({optionC: e.target.value})}/><br/>
          {/* <Button onClick={() => this.addOption()}>Enter question</Button><br/> */}
        <TextField type="text" label="Correct option" value={this.state.correctOption} onChange={(e) => this.setState({correctOption: e.target.value})}/><br/>

        <Button onClick={() => this.handleQuestionAddition()}>Next question</Button>
        <Button onClick={() => this.handleQuizComplete()}>Finish quiz</Button>
    </div>
    );
  }
}

export default NewQuiz;
