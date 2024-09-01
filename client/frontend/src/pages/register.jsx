import React, { useState } from "react";
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    function handleChange(e) {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });

 
        setErrors({
            ...errors,
            [e.target.name]: ''
        });
    }

    const validateInputs = () => {
        const newErrors = {};

        if (!userData.name) {
            newErrors.name = 'Invalid name';
        }

        if (!userData.email) {
            newErrors.email = 'Invalid email';
        }

        if (!userData.password) {
            newErrors.password = 'Weak password';
        }

        if (!userData.confirmPassword) {
            newErrors.confirmPassword = 'Password doesn\'t match';
        } else if (userData.password !== userData.confirmPassword) {
            newErrors.confirmPassword = 'Password doesn\'t match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const validationErrors = validateInputs();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            const { name, email, password, confirmPassword } = userData;
            const response = await register({ name, email, password, confirmPassword });

            if (response.status === 200) {
                console.log('User registered successfully');
                navigate('/dashboard')
               
            }else {
        
                if (response.data.error === 'User already exists') {
                    console.log( 'User already exists' );
                } 
                     else {
                setErrors({ general: 'Registration failed' });
            }
        }
        } catch (error) {
            setErrors({ general: error.message });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="labels">
                <label className="Name">Name</label>
                <label className="Email">Email</label>
                <label className="Pswd">Password</label>
                <label className="Cpswd">Confirm Password</label></div>
                <div className="Inputs">
                <div className="name">
                <input className={`nameInput ${errors.name ? 'input-error' : ''}`}
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        placeholder={errors.name || ''}
                        type="text"
                    />
                    
                </div>
            
                <div className="email">
                    
                <input className={`emailInput ${errors.email ? 'input-error' : ''}`}
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        placeholder={errors.email || ''}
                        type="email"
                    />
                
                </div>
                
                <div className="pswd">
                <input className={`pswdInput ${errors.password ? 'input-error' : ''}`}
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        placeholder={errors.password || ''}
                        type="password"
                    />
                    
                </div>
                
                <div className="cpswd">
                <input className={`cpswdInput ${errors.confirmPassword ? 'input-error' : ''}`}
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleChange}
                        placeholder= {errors.confirmPassword || ''}
                        type="password"
                    />
                    
                </div>
                </div>
                <button className="submitbtn" disabled={loading} type="submit">
                    {loading ? 'Submitting...' : 'Sign-Up'}
                </button>
            </form>
        </div>
    );
};

export default Register;