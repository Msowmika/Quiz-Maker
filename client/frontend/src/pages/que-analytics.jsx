import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestionWiseAnalytics } from '../services/quiz'; 

const QuestionWiseAnalytics = () => {
  const { quizId } = useParams(); 
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (quizId) {
      fetchAnalytics();
    }
  }, [quizId]);

  const fetchAnalytics = async () => {
    try {
      const response = await getQuestionWiseAnalytics(quizId);
      const data = response.data;

     
      if (Array.isArray(data)) {
        setAnalytics(data);
      } else {
        
        setAnalytics([]);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch question-wise analytics');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>{error}</div>;
  if (analytics.length === 0) return <div>No analytics available for this quiz</div>;

  return (
    <div>
      <h1>Question Wise Analytics</h1>
      <ul>
        {analytics.map((question, index) => (
          <li key={index}>
            <h2>{question.questionText}</h2>
            <p>Number of Attempts: {question.totalAttempts}</p>
            <p>Number of Correct Answers: {question.correctAnswers}</p>
            <p>Number of Incorrect Answers: {question.incorrectAnswers}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default QuestionWiseAnalytics;

