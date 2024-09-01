import React, { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });


        setErrors({
            ...errors,
            [e.target.name]: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!userData.email) {
            newErrors.email = 'Email is required';
        }
        if (!userData.password) {
            newErrors.password = 'Password is required';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const { email, password } = userData;
            const response = await login({ email, password });

            if (response.status === 200) {
                const { data } = response;
                localStorage.setItem('token', data.token);
                console.log("User logged in successfully");
                navigate('/dashboard');
            } else {
                setErrors({ general: 'Login failed' });
            }
        } catch (err) {
            setErrors({ general: err.message });
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='labels'>
                    <label className="Email">Email</label>
                    <label className="Pswd">Password</label>
                </div>
                <div className='inputs'>
                    <div className='email'>
                        <input 
                            className={`emailInput ${errors.email ? 'input-error' : ''}`}
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            placeholder={errors.email || ''}
                        />
                    </div>
                    <div className='pswd'>
                        <input 
                            className={`pswdInput ${errors.password ? 'input-error' : ''}`}
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            placeholder={errors.password || ''}
                        />
                    </div>
                </div>
                <button className="submitbtn">Login</button>
                {errors.general && <p className="error-message">{errors.general}</p>}
            </form>
        </div>
    );
};

export default Login;
