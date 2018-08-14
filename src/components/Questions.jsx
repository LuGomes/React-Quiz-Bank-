import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class NewQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      options: [],
      optionStorage: ''
    }
  }

  handleQuestionAddition() {
    this.props.socket.emit('addQuestion', {}, () => {

    });
    this.setState({question: '', options: []});
  }

  handleQuizComplete() {

    this.setState({question: '', options: []});
    this.props.app.setState({mode: "dashboard"});
  }

  addOption() {
    let optionsArr = this.state.options.slice();
    this.setState({options: optionsArr.concat(this.state.optionStorage)}, () => console.log(this.state.options));
  }

  render() {
    return (
      <div>
        <h1>This is a new question</h1>
        <TextField type="text" label="Enter question" onChange={(e) => this.setState({question: e.target.value})}/><br/>
        <TextField type="text" label="Option a." onChange={(e) => this.setState({optionStorage: e.target.value})}/>
          <Button onClick={() => this.addOption()}>Enter question</Button><br/>
        <TextField type="text" label="Option b." onChange={(e) => this.setState({optionStorage: e.target.value})}/>
          <Button onClick={() => this.addOption()}>Enter question</Button><br/>
        <TextField type="text" label="Option c." onChange={(e) => this.setState({optionStorage: e.target.value})}/>
          <Button onClick={() => this.addOption()}>Enter question</Button><br/>

        <Button onClick={() => this.handleQuestionAddition()}>Next question</Button>
        <Button onClick={() => this.handleQuizComplete()}>Finish quiz</Button>
    </div>
    );
  }
}

export default NewQuiz;
