import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

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
      this.setState({quizzes: quizzes, quizTaken: Array(quizzes.length).fill(false)});
    })
  }

  takeQuiz(quiz, order) {
    this.setState({quizTitle: quiz.title, score: '', order: order});
    this.props.app.socket.emit('takeQuiz', {quiz: quiz, user: this.props.app.state.user}, (data)=> {
      if (data.taken) {
        //if student has already taken quiz, alert
        let updatedQuizTakenArr = this.state.quizTakenArr.slice();
        updatedQuizTakenArr[order] = true;
        this.setState({currentQuiz: data.questions, studentAnswers: data.studentAnswers,
          showQuiz: true, quizTakenArr: updatedQuizTakenArr, score: data.score});
      } else {
        //no one has taken or you haven't taken, either way you can take this quiz
        this.setState({currentQuiz: data.questions, showQuiz: true});
      }
    })
  }

  handleSubmitQuiz() {
    let answers = [];
    for (let i = 0; i < this.state.currentQuiz.options.length; i++) {
      if(document.getElementById('A'+i).checked) {
        answers.push('a');
      } else if (document.getElementById('B'+i).checked) {
        answers.push('b');
      } else if (document.getElementById('C'+i).checked) {
        answers.push('c');
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
        this.setState({score: sum / correctOptions.length * 100 + "%"}, () => {
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
      if(this.state.studentAnswers[index] === currentQuiz.correctOptions[index]) {
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
  }

  render() {
    return (
      <div style={center}>
        <navbar style={{background: "linear-gradient(#c06c84, #f8b195)", padding: 20, width: "100%"}}>
          <h3>Welcome, {this.props.app.state.user.username}!</h3>
          <Button onClick={() => this.props.app.setState({mode: '', username: '', password: ''})}>Logout</Button>
        </navbar>
        {this.state.showQuiz ?
          <div style={center}>
            <p><strong>{this.state.quizTitle}</strong></p>
            {this.state.quizTakenArr[this.state.order] ? <Button variant="contained" color="secondary">You scored {this.state.score}</Button> : null}
            <ol>
              {this.state.currentQuiz.questions.map((question, index) => (
                <li style={{textAlign: "left", fontWeight: "bold"}}>{question}<div className="radio" style={{display: "flex", flexDirection: "column", fontWeight: "normal"}}>
                  <label style={this.color("a", index)}>
                    <input type="radio" name={index} id={"A"+index.toString()}/>{this.state.currentQuiz.options[index][0]}</label>
                  <label style={this.color("b", index)}>
                    <input type="radio" name={index} id={"B"+index.toString()}/>{this.state.currentQuiz.options[index][1]}</label>
                  <label style={this.color("c", index)}>
                    <input type="radio" name={index} id={"C"+index.toString()}/>{this.state.currentQuiz.options[index][2]}</label>
                </div></li>
              ))}
            </ol>
            {this.state.quizTakenArr[this.state.order] ? null : <div><Button onClick={() => this.handleSubmitQuiz()}>Submit Quiz</Button><br/></div>}
            <Button onClick={()=> this.backToDashboard()}>Back to Dashboard</Button>
          </div>
          :
          this.state.quizzes.map((quiz, order) => (<Button
          onClick={() => this.takeQuiz(quiz, order)}>{quiz.title}</Button>))
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
  width: "100%"
}

export default StudentDashboard;
