import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class NewQuiz extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>This is the new quiz page</h1>
        <Button onClick={() => this.props.app.setState({mode: "dashboard"})}>Back to dashboard</Button>
    </div>
    );
  }
}

export default NewQuiz;
