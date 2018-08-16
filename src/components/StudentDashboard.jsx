import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state= {
      quizzes: [],
      currentQuiz: {},
      showQuiz: false,
      studentAnswers: [],
      score: '',
      quizTitle: ''
    }
  }

  componentDidMount() {
    this.props.app.socket.emit('getStudentQuizzes', {}, (quizzes) => {
      this.setState({quizzes: quizzes});
    })
  }

  takeQuiz(quiz) {
    this.setState({quizTitle: quiz.title, score: ''});
    this.props.app.socket.emit('takeQuiz', {quiz: quiz, user: this.props.app.state.user}, (data)=> {
      if (data.taken) {
        //if student has already taken quiz, alert
        alert("you can only take a quiz once");
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
            score: this.state.score})
        });
      });
    }
  }

  backToDashboard() {
    this.setState({showQuiz: false})
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
            <p style={{color:"green"}}><strong>{this.state.quizTitle}</strong></p>
            {this.state.score ? <Button variant="contained" color="secondary">You scored {this.state.score}</Button> : null}
            <ol>
              {this.state.currentQuiz.questions.map((question, index) => (
                <li style={{textAlign: "left", fontWeight: "bold"}}>{question}<div className="radio" style={{display: "flex", flexDirection: "column", fontWeight: "normal"}}>
                  <label><input type="radio" name={index} id={"A"+index.toString()}/>{this.state.currentQuiz.options[index][0]}</label>
                  <label><input type="radio" name={index} id={"B"+index.toString()}/>{this.state.currentQuiz.options[index][1]}</label>
                  <label><input type="radio" name={index} id={"C"+index.toString()}/>{this.state.currentQuiz.options[index][2]}</label>

                </div></li>
              ))}
            </ol>
            {this.state.score ? null : <div><Button onClick={() => this.handleSubmitQuiz()}>Submit Quiz</Button><br/></div>}
            <Button onClick={()=> this.backToDashboard()}>Back to Dashboard</Button>
          </div>
          :
          this.state.quizzes.map(quiz => (<Button
          onClick={() => this.takeQuiz(quiz)}>{quiz.title}</Button>))
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
