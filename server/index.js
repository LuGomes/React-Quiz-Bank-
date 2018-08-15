var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var User = require('./models/models').User;
var Question = require('./models/models').Question;
var Quiz = require('./models/models').Quiz;

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
        next({err});
    })
  });

  socket.on('registration', function (data, next) {
    const {username, password, userType} = data;
    var newUser = new User({username: username, password: password, userType: userType});
    newUser.save((err, user) => {
      if(user) {
        next({user: user, err: null});
      } else {
        next({user: null, err: err});
      }
    })
  });

  socket.on('addQuestion', (data,next)=> {
    let newQuestion = new Question(
      {questions: data.questions,
        options: data.options,
        correctOptions: data.correctOptions,
        quiz: data.currQuizID
    });
    newQuestion.save((err,resp) =>{
  if (!err) {
    next({message: 'saved to mongoDB'})
  }
  else {
    next({message: 'error'})
  }
  });
  Quiz.findByIdAndUpdate({_id: data.currQuizID}, {isComplete: true})
  .exec()
  })

  socket.on('addQuiz', (data,next)=> {
    User.findOne({username: data.username})
    .exec()
    .then(user => {
      let newQuiz = new Quiz(
        {quizTitle: data.quizTitle,
          teacher: user._id,
          isComplete: false
        });

        newQuiz.save((err,resp) =>{
          if (!err) {
            next({message: 'new Quiz saved', currQuizID: resp._id})
          }
          else {
            next({message: err})
          }
        });
      })
    })

  socket.on('getQuizzes', (data,next) => {
    User.findOne({username: data.teacher})
    .exec()
    .then(user => {
      Quiz.find({teacher: user._id})
      .exec()
      .then(quiz => {
        next(quiz);
      })
    })
  });

  socket.on('getQuizzesForStudent', (data,next) => {
    Quiz.find().exec().then(quizzes => {
      next(quizzes);
    })
  });

  socket.on('getQuizById', (data, next) => {
    Question.findOne({quiz: data.quizId})
    .exec()
    .then(question => {
      // for(let i = 0; i < question.options.length; i++) {
      //   question.options[i].pop();
      // }
      next(question);
    })
  });
})

server.listen(3001, () => console.log("Listening to port 3001"));
