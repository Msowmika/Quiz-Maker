const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  participantId: {
    type: String,
    required: true,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
      selectedOption: String,
      isCorrect: Boolean,
    },
  ],
  score: {
    type: Number,
    default: 0,
  },
  attemptDate: {
    type: Date,
    default: Date.now,
  },
});

participantSchema.statics.getQuestionWiseAnalysis = async function (quizId) {
  const participants = await this.find({ quizId }).populate('answers.questionId');


  const analytics = {};

  participants.forEach((participant) => {
    participant.answers.forEach((answer) => {
      const questionId = answer.questionId._id.toString();

     
      if (!analytics[questionId]) {
        analytics[questionId] = {
          questionText: answer.questionId.text,
          attempts: 0,
          correct: 0,
          incorrect: 0,
        };
      }

    
      analytics[questionId].attempts += 1;
      if (answer.isCorrect) {
        analytics[questionId].correct += 1;
      } else {
        analytics[questionId].incorrect += 1;
      }
    });
  });


  return Object.keys(analytics).map((questionId) => ({
    questionId,
    ...analytics[questionId],
  }));
};

const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;
