
import axios from 'axios';
import { BACKEND_URL } from '../utils/constant';

const api = axios.create({
  baseURL: `${BACKEND_URL}`, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getQuizzes = () => api.get('/quizzes');
export const getQuiz = (id) => api.get(`/quiz/${id}`);
export const createQuiz = (data) => api.post('/quiz', data);
export const updateQuestion = (quizId, questionId, data) => api.post(`/quiz/${quizId}/questions/${questionId}`, data);
export const deleteQuiz = (id) => api.delete(`/del/quiz/${id}`);
export const getDashboardStats = () => api.get('/dashboard');
export const getAnalytics = () => api.get('/analytics');
export const shareQuiz = (quizId) => api.get(`/quiz/take/${quizId}`)





export const getQuestionWiseAnalytics = async (quizId) => {
  const response = await axios.get(`/participant/analytics/question-wise/${quizId}`);
  return response;
};




