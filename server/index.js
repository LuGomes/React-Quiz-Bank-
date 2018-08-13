var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var User = require('./models/models').User;


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
    const {username, password} = data;
    var newUser = new User({username: username, password: password});
    newUser.save((err, user) => {
      if(user) {
        next({user: user, err: null});
      } else {
        next({user: null, err: err});
      }
    })
  });
})

server.listen(3001, () => console.log("Listening to port 3001"));
