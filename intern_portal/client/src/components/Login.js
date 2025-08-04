// /client/src/components/Login.js
import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    const [userId, setUserId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userId) {
            onLogin(parseInt(userId));
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-form-card">
                <div className="login-logo-section">
                    <div className="login-logo"><i className="fas fa-cubes"></i></div>
                    <h2>Intern Portal</h2>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <p>Enter your User ID to continue</p>
                    <div className="input-group">
                        <i className="fas fa-user-circle"></i>
                        <input
                            type="number"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="User ID (e.g., 1, 2, 3)"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;