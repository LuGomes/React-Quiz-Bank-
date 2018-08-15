import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class TeacherDashboard extends Component {
  constructor(props) {
    super(props);
    this.state= {
      data: []
    }
  }
  componentDidMount() {
    this.props.socket.emit('getQuizzes', {teacher: this.props.app.state.username}, (data) => {
      this.setState({data: data}, () => console.log(data))
    })
  }

  render() {
    return (
      <div>
        <h1>Hello {this.props.app.state.username}</h1>
        {this.state.data.map(item => (<p>{item.quizTitle}: {item.isComplete.toString()}</p>))}
        <Button onClick={() => this.props.app.setState({mode: "newQuiz"})}>Create Quiz</Button>

    </div>
    );
  }
}

export default TeacherDashboard;
