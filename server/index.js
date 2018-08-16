var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var User = require('./models/models').User;
var Question = require('./models/models').Question;
var Quiz = require('./models/models').Quiz;
var Score = require('./models/models').Score;

io.on('connection', function (socket) {
  socket.on('login', function (data, next) {
    const {username, password} = data;
    User.findOne({username: username, password: password})
    .then(user => {
        if(user) {
          next({user: user, err: null});
        } else {
          next({user: null, err: null});
        }
     })
    .catch(err => {
        next({user: null, err: err});
    })
  });

  socket.on('registration', function (data, next) {
    const {username, password, userType} = data;
    var newUser = new User({username: username, password: password, userType: userType});
    newUser.save()
    .then(user => {
      next({user: user, err: null});
    })
    .catch(err => {
      next({user: null, err: err});
    })
  });

  socket.on('addQuiz', (data, next)=> {
    let newQuestion = new Question ({
      questions: data.questions,
      options: data.options,
      correctOptions: data.correctOptions,
      quiz: data.currQuiz._id
    });
    newQuestion.save()
    .then(Quiz.findByIdAndUpdate({_id: data.currQuiz._id}, {isComplete: true}).exec())
  });

  socket.on('createQuiz', (data, next)=> {
    let newQuiz = new Quiz({
      title: data.title,
      teacher: data.user._id,
      isComplete: false
      });
    newQuiz.save()
    .then(newQuiz => next(newQuiz));
  });


  socket.on('getTeacherQuizzes', (data, next) => {
    Quiz.find({teacher: data.teacher._id})
    .exec()
    .then(teacherQuizzes => {
      next(teacherQuizzes);
    })
  });

  socket.on('getStudentQuizzes', (data, next) => {
    Quiz.find().exec().then(quizzes => {
      let completedQuizzes = [];
      for(let i = 0; i < quizzes.length; i++) {
        if(quizzes[i].isComplete) completedQuizzes.push(quizzes[i]);
      }
      next(completedQuizzes);
    })
  });

  socket.on('submitScore', (data, next) => {
    Score.findOne({quiz: data.quizId})
    .exec()
    .then(score => {
      if (score) {
        let updatedStudents = score.students.concat([data.student._id]);
        let updatedScores = score.scores.concat([data.score]);
        Score.findOneAndUpdate({quiz: data.quizId}, {students: updatedStudents, scores: updatedScores})
        .exec()
      } else {
        let newScore = new Score({
          students: [data.student._id],
          quiz: data.quizId,
          scores: [data.score],
          studentAnswers: [data.studentAnswers]
        })
        newScore.save()
      }
    })
  })

  socket.on('getScores', (data, next) => {
    Score.findOne({quiz: data.quizId})
    .populate("students")
    .exec()
    .then(score => {
      if (score) {
        next(score);
      } else {
        next(null);
      }
    })
  });

  socket.on('takeQuiz', (data, next) => {
    Score.findOne({quiz: data.quiz._id})
    .exec()
    .then(score => {
      if(score) {
        let taken = false;
        let studentAnswers = [];
        let studentScore;
        for (let i = 0; i < score.students.length; i++) {
          if(data.user._id.toString() === score.students[i].toString()) {
            taken = true;
            studentAnswers = score.studentAnswers[i];
            studentScore = score.scores[i];
          }
        }
        if(taken) {
          Question.findOne({quiz: data.quiz._id})
          .exec()
          .then(questions => next({questions: questions, studentAnswers: studentAnswers, score: studentScore, taken: true}))
        } else {
          Question.findOne({quiz: data.quiz._id})
          .exec()
          .then(questions => next({questions: questions, taken: false}))
        }
      } else {
        Question.findOne({quiz: data.quiz._id})
        .exec()
        .then(questions => next({questions: questions, taken: false}))
      }
    })
  })
})

server.listen(3001, () => console.log("Listening to port 3001"));
