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



  socket.on('submitScore', (data, next) => {
    Score.findOne({quiz: data.quiz})
    .exec()
    .then(resp => {
      if (resp) {
        User.findOne({username: data.student})
        .exec()
        .then(user => {
          resp.students = resp.students.concat([user._id])
          resp.scores = resp.scores.concat([data.score])
          Score.findOneAndUpdate({quiz: data.quiz}, {students: resp.students, scores: resp.scores})
          .exec()
        })
        //quiz was taken by somebody already
      } else {
        //quiz hasnt been taken by anyone, i want to create a new document
        User.findOne({username:data.student})
        .exec()
        .then(user => {
          let newScore = new Score({
            students: [user._id],
            quiz: data.quiz,
            scores: [data.score]
          })
          newScore.save((err, resp)=> {
            if (!err) {
              next({message: 'Score Saved!', data:resp})
            } else {
              next({message: err})
            }
          })
        })
      }
    })
  })
  socket.on('getScores', (data, next) => {
    console.log(data.quizId)
    Score.findOne({quiz: data.quizId})
    .populate("students")
    .exec()
    .then(score => {
      console.log("this should be the score document", score)
      if (score) {
        next({data: score, message: "success!!!!"});

      } else {
        next({data: null, message:"no students have taken quiz yet"})
      }


    })
  });

})

server.listen(3001, () => console.log("Listening to port 3001"));
