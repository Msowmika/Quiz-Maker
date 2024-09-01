import React, { useState } from 'react';
import Register from '../pages/register';
import Login from '../pages/login';

const AuthenticationPage = () => {
    const [showSignUp, setShowSignUp] = useState(true);

    return (
        <div className="home" style={{ display: 'flex' }}>
            <span className='heading'>QUIZZIE</span>
            <div className="navbar" style={{ flex: 1, padding: '20px' }}>
                <button className="signupbtn" onClick={() => setShowSignUp(true)}>Sign Up</button>
                <button className="loginbtn" onClick={() => setShowSignUp(false)}>Log In</button>
            </div>
            <div className="login" style={{ flex: 2, padding: '20px' }}>
                {showSignUp ? <Register /> : <Login />}
            </div>
        </div>
    );
};

export default AuthenticationPage;
