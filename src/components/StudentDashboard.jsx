import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import styles from './styles';
import Paper from '@material-ui/core/Paper';

class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizzes: [],
      currentQuiz: {},
      studentAnswers: [],
      score: '',
      quizTitle: '',
      showQuiz: false,
      quizTakenArr: [],
      quizOrder : ''
    }
  }

  componentDidMount() {
    this.props.app.socket.emit('getStudentQuizzes', {}, (quizzes) => {
      this.setState({quizzes: quizzes, quizTakenArr: Array(quizzes.length).fill(false)});
    })
  }

  takeQuiz(quiz, order) {
    this.setState({quizTitle: quiz.title, score: '', order: order});
    this.props.app.socket.emit('takeQuiz', {quiz: quiz, user: this.props.app.state.user}, (data)=> {
      if (data.taken) {
        //if student has already taken quiz, alert
        let updatedQuizTakenArr = this.state.quizTakenArr.slice();
        updatedQuizTakenArr[this.state.order] = true;
        this.setState({currentQuiz: data.questions, studentAnswers: data.studentAnswers,
          showQuiz: true, score: data.score, quizTakenArr: updatedQuizTakenArr});
      } else {
        //no one has taken or you haven't taken, either way you can take this quiz
        this.setState({currentQuiz: data.questions, showQuiz: true});
      }
    })
  }

  handleSubmitQuiz() {
    let answers = [];
    for (let i = 0; i < this.state.currentQuiz.options.length; i++) {
      if(document.getElementById("a"+i).checked) {
        answers.push("a");
      } else if (document.getElementById('b'+i).checked) {
        answers.push("b");
      } else if (document.getElementById('c'+i).checked) {
        answers.push("c");
      } else {
        alert("Please select an answer for question", i + 1);
      }
    };
    if(answers.length === this.state.currentQuiz.options.length) {
      this.setState({studentAnswers: answers}, () => {
        let studentAnswers = this.state.studentAnswers;
        let correctOptions = this.state.currentQuiz.correctOptions;
        //calculate the score and send to backend
        let sum = 0;
        for(let i = 0; i < studentAnswers.length; i++) {
          if(correctOptions[i] === studentAnswers[i]) {
            sum ++;
          }
        }
        let updatedQuizTakenArr = this.state.quizTakenArr.slice();
        updatedQuizTakenArr[this.state.order] = true;
        this.setState({score: sum / correctOptions.length * 100 + "%", quizTakenArr: updatedQuizTakenArr}, () => {
          this.props.app.socket.emit('submitScore',
          {student: this.props.app.state.user,
            quizId: this.state.currentQuiz.quiz,
            score: this.state.score,
            studentAnswers: this.state.studentAnswers})
        });
      });
    }
  }

  backToDashboard() {
    this.setState({showQuiz: false})
  }

  color(option, index) {
    if(this.state.quizTakenArr[this.state.order]) {
      let {studentAnswers, currentQuiz} = this.state;
      if(studentAnswers[index] === currentQuiz.correctOptions[index]) {
        //got the question correct >>> paint it green if this is the current option, otherwise, don't do anything
        if(option === studentAnswers[index]) {
          return {backgroundColor: "#228b22"};
        }
      } else {
        //got the question wrong
        if(option === currentQuiz.correctOptions[index]) {
          return {backgroundColor: "#8fbc8f"};
        } else if(option === studentAnswers[index]) {
          return {backgroundColor: "#cd5c5c"};
        }
      }
      return {backgroundColor: "#eee"};
    }
    return {backgroundColor: "#eee"};
  }

  render() {
    return (
      <div style={center}>
        <navbar style={{background: "linear-gradient(#c06c84, #f8b195)", padding: 20, width: "100%"}}>
          <h3>Welcome, {this.props.app.state.user.username}!</h3>
          <Button style={styles.btn} onClick={() => this.props.app.setState({mode: '', username: '', password: ''})}>Logout</Button>
        </navbar>


        {this.state.showQuiz ?
          <div style={center}>
            <h3><strong>{this.state.quizTitle}</strong></h3>
            {this.state.quizTakenArr[this.state.order] ?
               <p>You scored {parseFloat(this.state.score).toFixed()} %</p> : null}
            <ol>
              {this.state.currentQuiz.questions.map((question, index) => (
                <li style={{textAlign: "left", fontWeight: "bold"}}>{question}<div className="radio"
                  style={{display: "flex", flexDirection: "column", fontWeight: "normal"}}>
                  <label style={this.color("a", index)}>
                    {this.state.quizTakenArr[this.state.order] ? "a." : <input type="radio" name={index} id={"a"+index.toString()}/>}
                    {this.state.currentQuiz.options[index][0]}</label>
                  <label style={this.color("b", index)}>
                    {this.state.quizTakenArr[this.state.order] ? "b." : <input type="radio" name={index} id={"b"+index.toString()}/>}
                    {this.state.currentQuiz.options[index][1]}</label>
                  <label style={this.color("c", index)}>
                    {this.state.quizTakenArr[this.state.order] ? "c." : <input type="radio" name={index} id={"c"+index.toString()}/>}
                    {this.state.currentQuiz.options[index][2]}</label>
                </div></li>
              ))}
            </ol>
            {this.state.quizTakenArr[this.state.order] ? null : <div><Button onClick={() => this.handleSubmitQuiz()}>Submit Quiz</Button><br/></div>}
            <Button style={styles.btn} onClick={()=> this.backToDashboard()}>Back to Dashboard</Button>
          </div>
          :
          <div style={{marginTop: 10}}>
            <Paper elevation={2} style={{padding: 30, fontFamily: "Courier New"}}>
              <h3> Quizzes: </h3>

              {this.state.quizzes.map((quiz, order) => (<div><Button style={styles.btn}
                onClick={() => this.takeQuiz(quiz, order)}>{quiz.title}</Button></div>))}

              </Paper>
            </div>
          }
        </div>
      );
    }
  }

const center = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "#eee",
  width: "100%",
  height: "100%",
}

export default StudentDashboard;
