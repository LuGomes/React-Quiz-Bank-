import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state= {
      quizzes: [],
      currentQuiz: {},
      showQuiz: false
    }
  }
  componentDidMount() {
    this.props.socket.emit('getQuizzesForStudent', {}, (data) => {
      this.setState({quizzes: data})
    })
  }

  takeQuiz(quizId) {
    this.props.socket.emit('getQuizById', {quizId: quizId}, (currentQuiz) => {
      this.setState({currentQuiz: currentQuiz, showQuiz: true});
    })
  }

  render() {
    return (
      <div>
        <h1>Welcome, {this.props.app.state.username}!</h1>
        {this.state.quizzes.map(quiz => (<Button onClick={() => this.takeQuiz(quiz._id)}>{quiz.quizTitle}</Button>))}
          {this.state.showQuiz ?
            <ol>{this.state.currentQuiz.questions.map((question, index) =>
                <li>{question}<ol>{this.state.currentQuiz.options[index].map(option => <li>{option}</li>)}</ol></li>)}
            </ol>
          : null}
    </div>
    );
  }
}

export default StudentDashboard;
