import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LoginRequired.css';

const LoginRequired = ({ pageName }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Start the 500ms delay
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 500 milliseconds

    // Cleanup timeout if component unmounts
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, []);

  // Show loading screen for 500ms
  if (isLoading) {
    return (
      <div className="login-required-container">
        <div className="login-required-content_loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          
          <h1 className="login-required-title">
            Loading...
          </h1>
          
          <p className="login-required-message">
            Preparing authentication page
          </p>
        </div>
      </div>
    );
  }

  // Show actual content after 500ms
  return (
    <div className="login-required-container">
      <div className="login-required-content">
        <div className="lock-icon">
          🔒
        </div>
        
        <h1 className="login-required-title">
          Authentication Required
        </h1>
        
        <p className="login-required-message">
          You must be logged in to access the {pageName} page.
        </p>
        
        <p className="login-required-subtitle">
          Please register for a new account or sign in to continue.
        </p>
        
        <div className="login-required-buttons">
          <Link to="/signup" className="btn btn-primary">
            Create Account
          </Link>
          
          <Link to="/login" className="btn btn-secondary">
            Sign In
          </Link>
        </div>
        
        <div className="login-required-footer">
          <Link to="/" className="home-link">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginRequired;