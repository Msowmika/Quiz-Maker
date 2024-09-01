import React, { useState } from 'react';
import Dashboard from '../pages/dashboard';
import QuizAnalytics from '../pages/analytics';
import QuizForm from '../pages/quizcreate';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        console.log('Logging out...');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'analytics':
                return <QuizAnalytics />;
            case 'createQuiz':
                return <QuizForm />;
            default:
                return <Dashboard />;
        }
    };

    return (
        
        <div className="dashboard-page">
        
            <div className="sidebar">
            <h1 className='heading1'>QUIZZES</h1>
                <button
                    className={activeTab === 'dashboard' ? 'active' : ''}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Dashboard
                </button>
                <button
                    className={activeTab === 'analytics' ? 'active' : ''}
                    onClick={() => setActiveTab('analytics')}
                >
                    Quiz Analytics
                </button>
                <button
                    className={activeTab === 'createQuiz' ? 'active' : ''}
                    onClick={() => setActiveTab('createQuiz')}
                >
                    Create Quiz
                </button>
                <button className="logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <div className="content">
                {renderContent()}
            </div>
        </div>
    );
};

export default DashboardPage;
