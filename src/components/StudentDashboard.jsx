import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state= {
      quizzes: [],
      currentQuiz: {},
      showQuiz: false,
      studentAnswers: [],
      score: ''
    }
  }
  componentDidMount() {
    this.props.socket.emit('getQuizzesForStudent', {}, (data) => {
      this.setState({quizzes: data});
    })
  }

  takeQuiz(quizId) {
    this.props.socket.emit('getQuizById', {quizId: quizId}, (currentQuiz) => {
      this.setState({currentQuiz: currentQuiz, showQuiz: true});
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
    if(answers.length == this.state.currentQuiz.options.length) {
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
        this.setState({score: sum / correctOptions.length * 100 + "%"});

      });
    }
  }

  render() {
    return (
      <div>
        <h1>Welcome, {this.props.app.state.username}!</h1>
        {this.state.quizzes.map(quiz => (<Button onClick={() => this.takeQuiz(quiz._id)}>{quiz.quizTitle}</Button>))}
        {this.state.showQuiz ?
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            {this.state.score ? <Button variant="contained" color="secondary">You scored {this.state.score}</Button> : null}
            <ol>
              {this.state.currentQuiz.questions.map((question, index) => (
                <li style={{textAlign: "left", fontWeight: "bold"}}>{question}<div className="radio" style={{display: "flex", flexDirection: "column", fontWeight: "normal"}}>
                  {/* {this.state.currentQuiz.options[index].map(option => <label><input type="radio" name={index}/>{option}</label>)} */}
                  <label><input type="radio" name={index} id={"A"+index.toString()}/>{this.state.currentQuiz.options[index][0]}</label>
                  <label><input type="radio" name={index} id={"B"+index.toString()}/>{this.state.currentQuiz.options[index][1]}</label>
                  <label><input type="radio" name={index} id={"C"+index.toString()}/>{this.state.currentQuiz.options[index][2]}</label>

                </div></li>
              ))}
            </ol>
            <Button onClick={() => this.handleSubmitQuiz()}>Submit Quiz</Button>
          </div>
          : null}
    </div>
    );
  }
}

export default StudentDashboard;
