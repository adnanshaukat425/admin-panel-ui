import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../logo.webp';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      setIsLoading(true);
      // Simulate API call with timeout
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 800);
    } else {
      setError('Please enter both username and password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="logo-container">
          <img src={logo} alt="ReactoSphere Logo" className="login-logo" />
        </div>
        <h1>Admin Panel</h1>
        <p className="login-subtitle">Chat Management Dashboard</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-icon-wrapper">
              <i className="input-icon fas fa-user"></i>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-icon-wrapper">
              <i className="input-icon fas fa-lock"></i>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="login-footer">© {new Date().getFullYear()} ReactoSphere Chat</p>
      </div>
    </div>
  );
};

export default Login; 