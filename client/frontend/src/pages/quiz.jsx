import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../utils/constant';

const TakeQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [participantId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/quiz/take/${id}`);
        setQuiz(response.data);
        const initialTimer = response.data.questions[0]?.timer || 0;
        setTimeLeft(initialTimer);
        setTimer(initialTimer);
      } catch (err) {
        console.log('Error fetching quiz:', err.message);
      }
    };

    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && timer !== null) {
      const interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            handleNext();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeLeft, timer]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      const nextQuestion = quiz.questions[currentQuestionIndex + 1];
      if (nextQuestion) {
        setTimeLeft(nextQuestion.timer || 0);
        setTimer(nextQuestion.timer || 0);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      setSelectedOption(null);
      const prevQuestion = quiz.questions[currentQuestionIndex - 1];
      if (prevQuestion) {
        setTimeLeft(prevQuestion.timer || 0);
        setTimer(prevQuestion.timer || 0);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const responses = quiz.questions.map(q => ({
        questionId: q._id,
        selectedOption: selectedOption || null
      }));

      const response = await axios.post(`${BACKEND_URL}/result`, { quizId: id, participantId, responses });
      setResult(response.data);
    } catch (error) {
      console.error('Error submitting quiz:', error.response?.data?.message || error.message);
    }
  };

  if (!quiz) return <div>Loading...</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  if (result) {
    if (result.message) {
      return <div className="result-message"><h1>Thank you for participating!</h1><p>{result.message}</p></div>;
    } else {
      return (
        <div className="result-message">
          <h1>Thank you for participating!</h1>
          <div className="score">Your Score: {result.correctAnswers}/{result.totalQuestions}</div>
        </div>
      );
    }
  }

  return (
    <div className="take-quiz">
      <h1>{quiz.title}</h1>
      <div className="question-container">
        <div className="question-number">
          Question {currentQuestionIndex + 1}/{quiz.questions.length}
        </div>
        <h2>{currentQuestion.text}</h2>
        <div className="options">
          {currentQuestion.options.map(option => (
            <div key={option._id} className="option">
              <input
                type="radio"
                id={option._id}
                name="option"
                value={option.text}
                checked={selectedOption === option.text}
                onChange={() => handleOptionChange(option.text)}
              />
              <label htmlFor={option._id}>{option.text}</label>
              {option.imageUrl && <img src={option.imageUrl} alt={option.text} />}
            </div>
          ))}
        </div>
        <div className="navigation">
          {currentQuestionIndex > 0 && <button onClick={handlePrev}>Previous</button>}
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button onClick={handleNext}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
        {timeLeft !== null && (
          <div className="timer">
            Time left: {timeLeft} seconds
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
