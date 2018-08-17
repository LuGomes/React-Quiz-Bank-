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
      currQuizQuestions: []
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
          showScores: true, currQuizTitle: quiz.title})
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

            {/* Trying to repeat code for each student */}
            {this.state.currQuizScore.students.map((student, index1) =>
              <div>
                {student.username} scored {this.state.currQuizScore.scores[index1]}<br/>
                <ol>
                  {this.state.currQuizQuestions.questions.map((question, index2) => (
                    <li style={{textAlign: "left", fontWeight: "bold"}}>{question}<div className="radio"
                      style={{display: "flex", flexDirection: "column", fontWeight: "normal"}}>
                      <label style={this.color("a", index1, index2)}>
                        <input type="radio" name={index2} id={"a"+index2.toString()}/>{this.state.currQuizQuestions.options[index2][0]}</label>
                      <label style={this.color("b", index1, index2)}>
                        <input type="radio" name={index2} id={"b"+index2.toString()}/>{this.state.currQuizQuestions.options[index2][1]}</label>
                      <label style={this.color("c", index1, index2)}>
                        <input type="radio" name={index2} id={"c"+index2.toString()}/>{this.state.currQuizQuestions.options[index2][2]}</label>
                    </div></li>
                  ))}
                </ol>
              </div>
            )}
            {/* Repeat this code for each student */}
            {/* {this.state.currQuizScore.students.map((student, index) => <span>{student.username} :
            {this.state.currQuizScore.scores[index]}<br/></span>)}
            <ol>
              {this.state.currQuizQuestions.questions.map((question, index) => (
                <li style={{textAlign: "left", fontWeight: "bold"}}>{question}<div className="radio"
                  style={{display: "flex", flexDirection: "column", fontWeight: "normal"}}>
                  <label >
                    <input type="radio" name={index} id={"a"+index.toString()}/>{this.state.currQuizQuestions.options[index][0]}</label>
                  <label >
                    <input type="radio" name={index} id={"b"+index.toString()}/>{this.state.currQuizQuestions.options[index][1]}</label>
                  <label >
                    <input type="radio" name={index} id={"c"+index.toString()}/>{this.state.currQuizQuestions.options[index][2]}</label>
                </div></li>
              ))}
            </ol> */}
            {/* Repeat this code for each student */}
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
