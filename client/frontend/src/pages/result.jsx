
import React from 'react';
import { useLocation } from 'react-router-dom';


const ResultPage = () => {
  const { state } = useLocation();
  const { score, message, quizType } = state || {};

  return (
    <div className="result-page">
      <div className="thank-you-message">Thank you for participating!</div>
      {quizType === 'MCQ' && score !== undefined && (
        <div className="score">Your score is: {score}</div>
      )}
      {quizType === 'Poll' && message && (
        <div className="message">{message}</div>
      )}
    </div>
  );
};

export default ResultPage;

