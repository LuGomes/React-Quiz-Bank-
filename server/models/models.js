import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true
  }
});

var quizSchema = new mongoose.Schema({
  quizTitle: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  isComplete: {
    type: Boolean,
    required: true

  }

})

var scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz'
  },
  score: {
    type: String,
    required: true
  }
})

var questionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz'
  },
  questions: [{
    type: String,
    required: true
  }],
  options: [[{
    type: String,
    required: true
  }]],
  correctOptions: [{
    type: String,
    required: true
  }],
})

const User = mongoose.model('User', userSchema);
const Quiz = mongoose.model('Quiz', quizSchema);
const Question = mongoose.model('Question', questionSchema);
const Score = mongoose.model('Score', scoreSchema);
module.exports = {User, Quiz, Question, Score};
