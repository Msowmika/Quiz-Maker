
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuiz, updateQuestion } from '../services/quiz';

const QuizList = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [editedQuestions, setEditedQuestions] = useState({});

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await getQuiz(id);
      setQuiz(response.data);
      initializeEditedQuestions(response.data.questions);
    } catch (err) {
      console.error('Error fetching quiz:', err.message);
    }
  };

  const initializeEditedQuestions = (questions) => {
    const initialData = {};
    questions.forEach((question) => {
      initialData[question._id] = {
        text: question.text,
        type: question.type,
        timer: question.timer,
        options: question.options.map((option) => ({
          text: option.text,
          imageUrl: option.imageUrl,
          isCorrect: option.isCorrect,
        })),
      };
    });
    setEditedQuestions(initialData);
  };

  const handleChange = (questionId, field, value) => {
    setEditedQuestions((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
      },
    }));
  };

  const handleOptionChange = (questionId, optionIndex, field, value) => {
    setEditedQuestions((prev) => {
      const updatedOptions = [...prev[questionId].options];
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        [field]: value,
      };
      return {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          options: updatedOptions,
        },
      };
    });
  };

  const handleUpdateQuestion = async (quizId, questionId) => {
    try {
      const updatedData = editedQuestions[questionId];
      await updateQuestion(quizId, questionId, updatedData);
      fetchQuiz(); 
    } catch (err) {
      console.error('Error updating question:', err.message);
    }
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div>
      <h1>{quiz.title}</h1>
      {quiz.questions.map((question) => (
        <div key={question._id}>
          <h2>Question:</h2>
          <input
            type="text"
            value={editedQuestions[question._id]?.text || ''}
            onChange={(e) =>
              handleChange(question._id, 'text', e.target.value)
            }
          />

          <h3>Type:</h3>
          <select
            value={editedQuestions[question._id]?.type || ''}
            onChange={(e) =>
              handleChange(question._id, 'type', e.target.value)
            }
            disabled
          >
            <option value="mcq">MCQ</option>
            <option value="poll">Poll</option>
          </select>

          <h3>Options:</h3>
          {question.options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                value={editedQuestions[question._id]?.options[index]?.text || ''}
                onChange={(e) =>
                  handleOptionChange(question._id, index, 'text', e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Image URL"
                value={
                  editedQuestions[question._id]?.options[index]?.imageUrl || ''
                }
                onChange={(e) =>
                  handleOptionChange(
                    question._id,
                    index,
                    'imageUrl',
                    e.target.value
                  )
                }
              />
              <label>
                <input
                  type="radio"
                  name={`correct-${question._id}`}
                  checked={editedQuestions[question._id]?.options[index]?.isCorrect || false}
                  onChange={() =>
                    handleOptionChange(question._id, index, 'isCorrect', true)
                  }
                />
                Correct
              </label>
            </div>
          ))}

          <h3>Timer:</h3>
          <select
            value={editedQuestions[question._id]?.timer || ''}
            onChange={(e) =>
              handleChange(question._id, 'timer', e.target.value)
            }
          >
            <option value="">No Timer</option>
            <option value="5">5 Seconds</option>
            <option value="10">10 Seconds</option>
          </select>

          <button onClick={() => handleUpdateQuestion(id, question._id)}>
            Update Question
          </button>
        </div>
      ))}
    </div>
  );
};

export default QuizList;
