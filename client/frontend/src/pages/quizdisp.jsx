import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../utils/constant';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!quizId || quizId.length !== 24) {
      setError('Invalid Quiz ID');
      return;
    }
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/quiz/take/${quizId}`);
        setQuiz(response.data);
      } catch (err) {
        setError('Failed to fetch quiz');
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionIndex, optionValue) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/quiz/submit/${quizId}`, {
        answers,
      });
      // Handle response, maybe show score or success message
      alert('Quiz submitted successfully!');
    } catch (err) {
      setError('Failed to submit quiz');
    }
  };

  if (error) return <p>{error}</p>;
  if (!quiz) return <p>Loading...</p>;

  return (
    <div>
      <h1>{quiz.title}</h1>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((question, index) => (
          <div key={question._id}>
            <h2>{question.text}</h2>
            {question.options.map((option, i) => (
              <div key={i}>
                <input
                  type={quiz.type === 'mcq' ? 'radio' : 'checkbox'}
                  name={`question_${index}`}
                  value={option.text}
                  onChange={() => handleOptionChange(index, option.text)}
                />
                {option.text}
              </div>
            ))}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TakeQuiz;
