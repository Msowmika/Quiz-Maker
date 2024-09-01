
const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: false }, 
  imageUrl: { type: String, required: false }, 
  isCorrect: { type: Boolean, default: false },
});

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [OptionSchema],
  answer: { type: String, required: false }, 
  timer: { type: Number, enum: [5, 10, null], default: null }, 
  attempts: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
  incorrect: { type: Number, default: 0 },
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'poll'], required: true },
  questions: [QuestionSchema],
  impressions: { type: Number, default: 0 }, 
  createdAt: { type: Date, default: Date.now },
  totalAttempts: { type: Number, default: 0 },
  totalCorrectGuesses: { type: Number, default: 0 },
  totalIncorrectGuesses: { type: Number, default: 0 }
});


QuizSchema.statics.calculateStatistics = async function () {
  const totalQuizzes = await this.countDocuments();
  const quizzes = await this.find();
  const totalQuestions = quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);
  const totalImpressions = quizzes.reduce((acc, quiz) => acc + quiz.impressions, 0);

  return { totalQuizzes, totalQuestions, totalImpressions };
};


QuizSchema.statics.getTrendingQuizzes = async function () {
  const quizzes = await this.find().sort({ impressions: -1 }).limit(2); 

  
  quizzes.forEach((quiz, index) => {
    quiz.rank = index + 1;
  });

  return quizzes;
};


QuizSchema.statics.getQuizAnalytics = async function () {
  const quizzes = await this.find().sort({ createdAt: -1 }); 

 
  return quizzes.map((quiz, index) => ({
    sNo: index + 1, 
    title: quiz.title,
    createdAt: quiz.createdAt,
    impressions: quiz.impressions,
    edit: `/quiz/${quiz._id}`,
    delete: `/del/quiz/${quiz._id}`, 
    share: `/quiz/take/${quiz._id}`,
    questionAnalytics: quiz.questions.map((q, idx) => ({
      questionNo: idx + 1,
      questionText: q.text,
      attempts: q.attempts, 
      correct: q.correct,
      incorrect: q.incorrect, 
    })),
  }));
};



module.exports = mongoose.model('Quiz', QuizSchema);
