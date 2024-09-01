const express = require('express');
const router = express.Router();
const Quiz = require('../schema/quizz-schema');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose')
const Participant = require('../schema/participant-schema')



router.get('/', (req, res) => {
  res.send('Hello world!');
});


router.get('/quizzes', authMiddleware, async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.userId }).exec();
    res.status(200).json(quizzes);
  } catch (err) {
    next(err);
  }
});


router.get('/quiz/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const quiz = await Quiz.findById(id).exec();

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json(quiz);
  } catch (err) {
    next(err);
  }
});


router.post('/quiz', async (req, res, next) => {
  try {
    const { title,questions,type } = req.body;

    if (!title || !questions || questions.length === 0) {
      throw new Error('Title and Questions are required');
    }

    for (const question of questions) {
      if (question.type !== 'mcq' && question.type !== 'poll') {
        throw new Error('Invalid question type');
      }

      if (question.options.length < 2 || question.options.length > 4) {
        return res.status(500).json(`${question.type.toUpperCase()} questions should contain between 2 and 4 alternatives`);
      }
    }

    if (questions.length > 5) {
      return res.status(500).json('Maximum number of questions in a quiz should be 5');
    }

    const quiz = new Quiz({ title, questions,type, createdBy: req.userId });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
});


router.post('/quiz/:quizId/questions/:questionId', authMiddleware, async (req, res, next) => {
  try {
    const { quizId, questionId } = req.params;
    const { text, options, timer, type } = req.body;

  
    const quiz = await Quiz.findOne({ _id: quizId, createdBy: req.userId }).exec();

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found', success: false });
    }


    const existingQuestion = quiz.questions.id(questionId);

    if (!existingQuestion) {
      return res.status(404).json({ message: `Question with ID ${questionId} not found`, success: false });
    }


    if (req.body.type !== existingQuestion.type) {
      return res.status(400).json({ message: 'Type cannot be changed', success: false });
    }

    if (options) {
      if (options.length < 2 || options.length > 4) {
        return res.status(400).json({ message: 'Options must be between 2 and 4', success: false });
      }

      if (options.length !== existingQuestion.options.length) {
        return res.status(400).json({ message: 'Cannot add or remove options for the question', success: false });
      }

      options.forEach((newOption, index) => {
        const existingOption = existingQuestion.options[index];


        if (existingOption.isCorrect && newOption.text !== existingOption.text) {
          return res.status(400).json({ message: 'Cannot change the text of the correct option', success: false });
        }

        existingOption.text = newOption.text;
        existingOption.imageUrl = newOption.imageUrl;

        if (existingOption.isCorrect !== newOption.isCorrect) {
          return res.status(400).json({ message: 'Cannot change the correct answer flag', success: false });
        }
      });
    }

   
    if (text !== undefined) existingQuestion.text = text;
    if (timer !== undefined) existingQuestion.timer = timer;

  
    await quiz.save();
    res.status(200).json({ message: 'Question updated successfully', quiz, success: true });
  } catch (err) {
    next(err);
  }
});


router.delete('/del/quiz/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;
    const quiz = await Quiz.findByIdAndDelete(_id).exec();

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    next(err);
  }
});



router.get('/dashboard', async (req, res) => {
  try {

    const quizzes = await Quiz.aggregate([
      {
        $addFields: {
          totalImpressions: {
            $sum: "$questions.impressions"
          }
        }
      },
      {
        $sort: { totalImpressions: -1 }
      }
    ]).exec();

   
    const totalQuizzes = quizzes.length;
    const totalQuestions = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
    const totalImpressions = quizzes.reduce((sum, quiz) => sum + quiz.totalImpressions, 0);

    res.status(200).json({
      totalQuizzes,
      totalQuestions,
      totalImpressions,
      trendingQuizzes: quizzes
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get('/analytics', async (req, res) => {
  try {
      const analytics = await Quiz.getQuizAnalytics();
      res.json(analytics);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching analytics' });
  }
});



router.post('/result', async (req, res) => {
  const { quizId, participantId, responses } = req.body;

  try {
      const quiz = await Quiz.findById(quizId).exec();
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

      if (quiz.type === 'poll') {
        
          await Participant.create({
              quizId,
              participantId,
              answers: responses,
              score: null 
          });

          return res.status(200).json({ message: 'Thank you for participating!' });
      } else if (quiz.type === 'mcq') {
        
          let score = 0;
          const totalQuestions = quiz.questions.length;

          responses.forEach(response => {
              const question = quiz.questions.id(response.questionId);
              if (question) {
                  const selectedOption = question.options.find(option => option.text === response.selectedOption);
                  if (selectedOption && selectedOption.isCorrect) {
                      score += 1;
                  }
              }
          });

          await Participant.create({
              quizId,
              participantId,
              answers: responses,
              score
          });

          return res.status(200).json({ correctAnswers: score, totalQuestions });
      }
  } catch (error) {
      console.error('Error submitting quiz:', error.message);
      res.status(500).json({ message: 'Server error' });
  }
});


router.get('/quiz/take/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz); 
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;