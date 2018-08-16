import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class TeacherDashboard extends Component {
  constructor(props) {
    super(props);
    this.state= {
      data: [],
      showScores: false,
      currQuizScore: {},
      currQuizTitle: ''
    }
  }
  componentDidMount() {
    this.props.socket.emit('getQuizzes', {teacher: this.props.app.state.username}, (data) => {
      this.setState({data: data})
    })
  }

  handleGetScores(quizId, quizTitle) {
    this.props.socket.emit('getScores', {quizId: quizId}, (data) => {
      if (data) {
        this.setState({currQuizScore: data.data, showScores: true, currQuizTitle: quizTitle})
      } else {
        alert(data.message)
      }
      console.log(data.message);

    })
  }

  backToDashboard() {
    this.setState({showScores: false})
  }

  render() {
    return (
      <div>
        <h1>Hello {this.props.app.state.username}</h1>
        {this.state.showScores?
          <div>
            <h3>{this.state.currQuizTitle} </h3>
              {this.state.currQuizScore?
                <div>
                  {this.state.currQuizScore.students.map((item, index) => <span> {item.username} :
                    {this.state.currQuizScore.scores[index]}<br/></span>)}
              <Button onClick={()=> this.backToDashboard()}>Back to Dashboard</Button> </div> :
              <div>
              <p> No students have taken this quiz yet </p>
              <Button onClick={()=> this.backToDashboard()}>Back to Dashboard</Button>
            </div>
          }

          </div> :

          (
            <div>
              {this.state.data.map(item => (<Button onClick={()=> this.handleGetScores(item._id)}>{item.quizTitle}: {item.isComplete.toString()}</Button>))}<br/>
              <Button onClick={() => this.props.app.setState({mode: "newQuiz"})}>Create Quiz</Button><br/>
              <Button onClick={() => this.props.app.setState({mode: '', username: '', password: ''})}>Logout</Button>
            </div>)
          }


        </div>
      );
  }
}

export default TeacherDashboard;
