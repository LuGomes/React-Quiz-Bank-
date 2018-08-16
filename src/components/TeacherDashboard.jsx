import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

class TeacherDashboard extends Component {
  constructor(props) {
    super(props);
    this.state= {
      teacherQuizzes: [],
      showScores: false,
      currQuizScore: {},
      currQuizTitle: ''
    }
  }
  componentDidMount() {
    this.props.app.socket.emit('getTeacherQuizzes', {teacher: this.props.app.state.user}, (teacherQuizzes) => {
      this.setState({teacherQuizzes: teacherQuizzes});
    });
  }

  handleGetScores(quiz) {
    this.props.app.socket.emit('getScores', {quizId: quiz._id}, (score) => {
      if (score) {
        this.setState({currQuizScore: score, showScores: true, currQuizTitle: quiz.title})
      } else {
        alert("no students have taken this quiz yet :(");
      }
    });
  }

  backToDashboard() {
    this.setState({showScores: false});
  }

  render() {
    return (
      <div>
        <h1>Hello, {this.props.app.state.user.username}!</h1>
        {this.state.showScores ?
        <div>
          {this.state.currQuizScore ?
          <div>
            <h3>{this.state.currQuizTitle} </h3>
            {this.state.currQuizScore.students.map((student, index) => <span>{student.username} :
            {this.state.currQuizScore.scores[index]}<br/></span>)}
          </div> :
            <div>
              <span> No students have taken this quiz yet </span>
            </div>}
            <Button onClick={()=> this.backToDashboard()}>Back to Dashboard</Button>
        </div> :
        <div>
          {this.state.teacherQuizzes.map(quiz =>
            <Button style={quiz.isComplete ? {backgroundColor: "green"} : {backgroundColor: "red"}}
              onClick={()=> this.handleGetScores(quiz)}>{quiz.title}</Button>)}<br/>
          <Button onClick={() => this.props.app.setState({mode: "newQuiz"})}>Create Quiz</Button><br/>
          <Button onClick={() => this.props.app.setState({mode: '', user: {}})}>Logout</Button>
        </div>}
      </div>
    );
  }
}

export default TeacherDashboard;
