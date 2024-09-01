import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../utils/constant';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import  dlt  from '../delete.png';
import  edit  from '../edit.png';
import  share  from '../share.png';

const QuizAnalytics = () => {
  const { id } = useParams()
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/analytics`);
        setAnalytics(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch analytics');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleShareClick = (id) => {
    console.log(id)
    const link = `${BACKEND_URL}/quiz/take/66cafd828d306dec233a9c56`;
    navigator.clipboard.writeText(link)
      .then(() => {
        alert('Quiz link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    <h1 className='analysis' style={{marginTop : "50px"}}>Quiz Analysis</h1>
    <div className="quiz-analytics-container">
    <div className="header-row">
      <div className="header-item">S.No</div>
      <div className="header-item">Quiz Name</div>
      <div className="header-item">Created On</div>
      <div className="header-item">Impressions</div>
    </div>
      <div className="analytics-list">
        {analytics.map((quiz, index) => (
          <div className={`analytics-item ${index % 2 === 0 ? 'even' : 'odd'}`} key={quiz.sNo}>
            <div className="item-data">{quiz.sNo}</div>
            <div className="item-data">{quiz.title}</div>
            <div className="item-data">{quiz.createdAt}</div>
            <div className="item-data">{quiz.impressions}</div>
            
            <div className="item-data">
              <a href={quiz.edit} className="icon"><img src={edit} alt=''/></a>
            </div>
            <div className="item-data">
              <a href={quiz.delete} className="icon"><img src={dlt} alt=''/></a>
            </div>
            <div className="item-data">
              <button onClick={() => handleShareClick(id)} className="icon"><img src={ share } alt=''/></button>
            </div>
            <div className="item-data">
              <Link to={`${BACKEND_URL}/quiz/${id}/analytics`}><p className='link'>View Question Analytics</p></Link>
            </div>
            </div>
        
        ))}
      </div>
    </div>
    </>
  );
  
};

export default QuizAnalytics;
