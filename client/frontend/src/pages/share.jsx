import React from 'react';
import { BACKEND_URL } from '../utils/constant';

const ShareQuizLink = ({ id }) => {

  const shareLink = async () => {
    const link = `${BACKEND_URL}/quiz/take/${id}`;

    try {
      await navigator.clipboard.writeText(link); 
      alert('Quiz link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link: ', err);
      alert('Failed to copy the link. Please try again.');
    }
  };

  return (
    <button onClick={shareLink}>
      Share Quiz Link
    </button>
  );
};

export default ShareQuizLink;


