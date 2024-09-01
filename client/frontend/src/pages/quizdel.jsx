
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, deleteQuiz } from '../services/quiz';

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await getQuiz(id);
      setQuiz(response.data);
    } catch (err) {
      console.error('Error fetching quiz details:', err.message);
      setError('Failed to load quiz details.'); 
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(id);
        navigate('/analytics'); 
      } catch (err) {
        console.error('Error deleting quiz:', err.message);
        setError('Failed to delete the quiz.'); 
      }
    }
  };

  if (error) return <div>{error}</div>; 
  if (!quiz) return <div>Loading...</div>;

  return (
    <div>
      <h1>{quiz.title}</h1>
      <ul>
        {quiz.questions.map((question) => (
          <li key={question._id}>
            <h2>{question.text}</h2>
            <ul>
              {question.options.map((option) => (
                <li key={option._id}>
                  {option.text} 
                  {option.imageUrl && <img src={option.imageUrl} alt={option.text} style={{ maxWidth: '200px', maxHeight: '200px' }} />}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button onClick={handleDelete}>Delete Quiz</button>
    </div>
  );
};

export default QuizDetail;
