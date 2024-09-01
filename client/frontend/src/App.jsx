import React from 'react';
import {Routes,Route} from "react-router-dom"
import './App.css';
import QuizAnalytics from './pages/analytics';
import QuizForm from './pages/quizcreate';
import QuizDetail from './pages/quizupdt';
import QuizList from './pages/quizdel';
import TakeQuiz from './pages/quiz';
import DashboardPage from './pages/dashboardPage';
import QuestionWiseAnalysis from './pages/que-analytics';
import AuthenticationPage from './pages/authenticationPage';
import ResultPage from './pages/result';

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={< AuthenticationPage/>}/>
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/analytics" element={< QuizAnalytics/>}/>
        <Route path="/create-quiz" element={< QuizForm/>}/>

        <Route path="/del/quiz/:id" element={<QuizList />} />
        
        <Route path="/quiz/:id" element={<QuizDetail/>} />
       
        <Route path="/result" element={<ResultPage />} />
        <Route path="/quiz/take/:id" element={< TakeQuiz/>}/>
        <Route path="/participant/analytics/question-wise/:id" element={< QuestionWiseAnalysis/>}/>
       
      </Routes>
     </>
)}

export default App;
