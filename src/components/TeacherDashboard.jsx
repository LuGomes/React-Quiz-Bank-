import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

class TeacherDashboard extends Component {
  constructor(props) {
    super(props);
    this.state= {
      teacherQuizzes: [],
      showScores: false,
      currQuizScore: {},
      currQuizTitle: '',
      currQuizQuestions: [],
      currQuiz: {}
    }
  }

  componentDidMount() {
    this.props.app.socket.emit('getTeacherQuizzes', {teacher: this.props.app.state.user}, (teacherQuizzes) => {
      this.setState({teacherQuizzes: teacherQuizzes});
    });
  }

  handleGetScores(quiz) {
    this.props.app.socket.emit('getScores', {quizId: quiz._id}, (data) => {
      if (data) {
        this.setState({currQuizScore: data.score, currQuizQuestions: data.questions,
          showScores: true, currQuizTitle: quiz.title})
      } else {
        // alert("no students have taken this quiz yet :(");
        this.setState({currQuizQuestions: data.questions,
          showScores: true, currQuizTitle: quiz.title, currQuiz: quiz})
      }
    });
  }

  backToDashboard() {
    this.setState({showScores: false});
  }

  color(option, studentIndex, questionIndex) {
    let studentAnswers = this.state.currQuizScore.studentAnswers[studentIndex];
    if(studentAnswers[questionIndex] === this.state.currQuizQuestions.correctOptions[questionIndex]) {
      //got the question correct >>> paint it green if this is the current option, otherwise, don't do anything
      if(option === studentAnswers[questionIndex]) {
        return {backgroundColor: "#228b22"};
      }
    } else {
      //got the question wrong
      if(option === this.state.currQuizQuestions.correctOptions[questionIndex]) {
        return {backgroundColor: "#8fbc8f"};
      } else if(option === studentAnswers[questionIndex]) {
        return {backgroundColor: "#cd5c5c"};
      }
    }
    return {backgroundColor: "#eee"};
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
            {this.state.currQuizScore.students.map((student, index1) =>
              <div>
                {student.username} scored {this.state.score}<br/>
                <ol>
                  {this.state.currQuizQuestions.questions.map((question, index2) => (
                    <li style={{textAlign: "left", fontWeight: "bold"}}>{question}<div className="radio"
                      style={{display: "flex", flexDirection: "column", fontWeight: "normal"}}>
                      <label style={this.color("a", index1, index2)}>
                        a. {this.state.currQuizQuestions.options[index2][0]}</label>
                      <label style={this.color("b", index1, index2)}>
                        b. {this.state.currQuizQuestions.options[index2][1]}</label>
                      <label style={this.color("c", index1, index2)}>
                        c. {this.state.currQuizQuestions.options[index2][2]}</label>
                    </div></li>
                  ))}
                </ol>
              </div>
            )}
          </div> :
            <div>
              {this.state.currQuiz.isComplete? <span> No students have taken this quiz yet </span> : "This quiz is not complete, add edit functionality here"}
              <ol>
                {this.state.currQuizQuestions.questions.map((question, index) => (
                  <li style={{textAlign: "left", fontWeight: "bold"}}>{question}<div className="radio"
                    style={{display: "flex", flexDirection: "column", fontWeight: "normal"}}>
                    <label>a. {this.state.currQuizQuestions.options[index][0]}</label>
                    <label>b. {this.state.currQuizQuestions.options[index][1]}</label>
                    <label>c. {this.state.currQuizQuestions.options[index][2]}</label>
                  </div></li>
                ))}
              </ol>
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
