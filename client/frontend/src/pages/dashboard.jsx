import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../utils/constant';
import eyes from '../eyes.png'

const Dashboard = () => {
    const [analytics, setAnalytics] = useState({
        totalQuizzes: 0,
        totalQuestions: 0,
        totalImpressions: 0,
        trendingQuizzes: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/dashboard`);
                setAnalytics(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch analytics');
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-summary">
                <div className="summary-box1">
                    <p>{analytics.totalQuizzes}<h2>Quiz Created</h2></p>
                    
                </div>
                <div className="summary-box2">
                    <p>{analytics.totalQuestions}<h2>questions Created</h2></p>
                    
                </div>
                <div className="summary-box3">
                    <p>{analytics.totalImpressions}<h2>Total Impressions</h2></p>
             
                </div>
            </div>
            <div className="trending-quizzes">
            <h2 className='trend'>Trending Quizs</h2>
                <div className="trending-quizzes-list">
                
                    {analytics.trendingQuizzes.map((quiz) => (
                        <div className="quiz-box" key={quiz._id}>
                            <div className='imp'>
                            <h3 className='impscore'>{quiz.title}</h3>
                            <p className='Impressions'>{quiz.totalImpressions}<img src={eyes} alt=''/></p></div>
                            <p className='date'>Created At: {new Date(quiz.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
