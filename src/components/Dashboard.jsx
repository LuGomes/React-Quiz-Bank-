import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state= {
      data: []
    }
  }
  componentDidMount() {
    this.props.socket.emit('getQuizzes', {}, (data) => {
      console.log(data);
      this.setState({data: data})
    })
  }

  render() {
    return (
      <div>
        <h1>Hello {this.props.app.state.username}</h1>
        {this.state.data.map(item => (<p>{item}</p>))}
        <Button onClick={() => this.props.app.setState({mode: "newQuiz"})}>Create Quiz</Button>

    </div>
    );
  }
}

export default Dashboard;
