import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { createQuiz } from '../services/quiz';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { BACKEND_URL } from '../utils/constant';

const QuizForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showPublishedModal, setShowPublishedModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('mcq');
  const [optionType, setOptionType] = useState('text');
  const [timer, setTimer] = useState('');
  const [quizLink, setQuizLink] = useState('');
  const [questions, setQuestions] = useState([
    {
      text: '',
      type: 'mcq',
      options: [{ text: '', imageUrl: '', isCorrect: false }, { text: '', imageUrl: '', isCorrect: false }],
      timer: '',
    },
  ]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleContinue = () => {
    setShowModal(false);
    setShowQuestionModal(true);
  };

  const handleAddQuestion = () => {
    const updatedQuestions = [...questions];
    updatedQuestions.shift();
    updatedQuestions.push({
      text: '',
      type: 'mcq',
      options: [{ text: '', imageUrl: '', isCorrect: false }, { text: '', imageUrl: '', isCorrect: false }],
      timer: '',
    });
    setQuestions(updatedQuestions);
  };

  const handleCloseQuestionModal = () => {
    setShowQuestionModal(false);
  };

  const handleAddOption = () => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[0].options.length < 4) {
      updatedQuestions[0].options.push({ text: '', imageUrl: '', isCorrect: false });
      setQuestions(updatedQuestions);
    }
  };

  const handleRemoveOption = (optionIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[0].options.length > 2) {
      updatedQuestions[0].options.splice(optionIndex, 1);
      setQuestions(updatedQuestions);
    }
  };

  const handleOptionTextChange = (optionIndex, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[0].options[optionIndex].text = text;
    setQuestions(updatedQuestions);
  };

  const handleOptionImageUrlChange = (optionIndex, imageUrl) => {
    const updatedQuestions = [...questions];
    updatedQuestions[0].options[optionIndex].imageUrl = imageUrl;
    setQuestions(updatedQuestions);
  };

  const handleOptionCorrectChange = (optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[0].options.forEach((opt, index) => {
      opt.isCorrect = index === optionIndex;
    });
    setQuestions(updatedQuestions);
  };

  const handleCreateQuiz = async () => {
    try {
      const response = await createQuiz({ title, type, questions });
      setQuizLink(`${BACKEND_URL}/quiz/take/${response.data.quizId}`);
      setShowQuestionModal(false);
      setShowPublishedModal(true);
    } catch (err) {
      console.error('Error creating quiz:', err.message);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(quizLink);
    toast.success('Link copied to clipboard!'); 
  };

  const handleClosePublishedModal = () => {
    setShowPublishedModal(false);
  };

  return (
    <div className="quiz-form">
      <button type="button" onClick={handleOpenModal}>
        Create Quiz
      </button>

      {showModal && ReactDOM.createPortal(
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create Quiz</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quiz Title"
            />
            <label>
              Quiz Type:
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="mcq">MCQ</option>
                <option value="poll">Poll</option>
              </select>
            </label>
            <button onClick={handleCloseModal}>Cancel</button>
            <button onClick={handleContinue}>Continue</button>
          </div>
        </div>,
        document.body
      )}

      {showQuestionModal && ReactDOM.createPortal(
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Setup Quiz Questions</h2>
            <p>Questions Created: {questions.length}</p>
            <input
              type="text"
              value={questions[0].text} 
              onChange={(e) => {
                const updatedQuestions = [...questions];
                updatedQuestions[0].text = e.target.value;
                setQuestions(updatedQuestions);
              }}
              placeholder="Question Text"
            />
            <div className="option-type">
              <h3>Option Type</h3>
              <label>
                <input
                  type="radio"
                  name="optionType"
                  value="text"
                  onChange={(e) => setOptionType(e.target.value)}
                  checked={optionType === 'text'}
                />
                Text
              </label>
              <label>
                <input
                  type="radio"
                  name="optionType"
                  value="imageUrl"
                  onChange={(e) => setOptionType(e.target.value)}
                  checked={optionType === 'imageUrl'}
                />
                Image URL
              </label>
              <label>
                <input
                  type="radio"
                  name="optionType"
                  value="both"
                  onChange={(e) => setOptionType(e.target.value)}
                  checked={optionType === 'both'}
                />
                Text & Image URL
              </label>
            </div>
            <div className="options">
              <h3>Options</h3>
              {questions[0].options.map((option, index) => (
                <div key={index} className="option-input">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(index, e.target.value)}
                    placeholder={`Option ${index + 1} Text`}
                  />
                  {(optionType === 'imageUrl' || optionType === 'both') && (
                    <input
                      type="text"
                      value={option.imageUrl}
                      onChange={(e) => handleOptionImageUrlChange(index, e.target.value)}
                      placeholder={`Option ${index + 1} Image URL`}
                    />
                  )}
                  {questions[0].options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="remove-option"
                    >
                      Remove
                    </button>
                  )}
                  <label>
                    <input
                      type="radio"
                      name="correctOption"
                      checked={option.isCorrect}
                      onChange={() => handleOptionCorrectChange(index)}
                    />
                    Correct
                  </label>
                </div>
              ))}
              <button type="button" onClick={handleAddOption} className="add-option">
                Add Option
              </button>
            </div>
            <div className="timer">
              <h3>Timer</h3>
              <div className="timer-options">
                <label>
                  <input
                    type="radio"
                    name="timer"
                    value=""
                    onChange={(e) => setTimer(e.target.value)}
                    checked={timer === ''}
                  />
                  OFF
                </label>
                <label>
                  <input
                    type="radio"
                    name="timer"
                    value="5"
                    onChange={(e) => setTimer(e.target.value)}
                    checked={timer === '5'}
                  />
                  5 seconds
                </label>
                <label>
                  <input
                    type="radio"
                    name="timer"
                    value="10"
                    onChange={(e) => setTimer(e.target.value)}
                    checked={timer === '10'}
                  />
                  10 seconds
                </label>
              </div>
            </div>
            <button onClick={handleAddQuestion} className="add-question">Add Question</button>
            <button onClick={handleCloseQuestionModal}>Cancel</button>
            <button onClick={handleCreateQuiz}>Create Quiz</button>
          </div>
        </div>,
        document.body
      )}

      
      {showPublishedModal && ReactDOM.createPortal(
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Congrats, your quiz is published!</h2>
            <input
              type="text"
              readOnly
              value={quizLink}
              aria-label="Quiz Link"
            />
            <button
              onClick={handleCopyLink}
              className="share-button"
            >
              Share
            </button>
            <button onClick={handleClosePublishedModal} className="close-popup">
              &times;
            </button>
          </div>
        </div>,
        document.body
      )}

      <ToastContainer />
    </div>
  );
};

export default QuizForm;
