import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

class NewQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ''
    }
  }

  render() {
    return (
      <div>
        <h1>This is the new quiz page</h1>
        <TextField type="text" label="Title" onChange={(e) => this.setState({title: e.target.value})}/><br/>
        <Button onClick={() => this.props.app.setState({mode: "questions"})}>Add question</Button>
        <Button onClick={() => this.props.app.setState({mode: "dashboard"})}>Back to dashboard</Button>
    </div>
    );
  }
}

export default NewQuiz;
