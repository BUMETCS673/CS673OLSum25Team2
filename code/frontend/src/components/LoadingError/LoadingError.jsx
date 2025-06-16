import React from 'react';
import './LoadingError.css'; // Import the CSS file
import '../LoginRequired/LoginRequired.css';
// Loading Component
export const LoadingSpinner = ({ message = "Loading..." }) => {
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
            Preparing {message} page
          </p>
        </div>
      </div>
  );
};

// Error Component
export const ErrorMessage = ({ error, title = "Error" }) => {
  return (
    <div className="error-container">
      <div className="error-header">
        <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <h3 className="error-title">{title}</h3>
      </div>
      <p className="error-message">
        {error?.message || error || "An unexpected error occurred"}
      </p>
    </div>
  );
};

// Success Component
export const SuccessMessage = ({ message, title = "Success" }) => {
  return (
    <div className="success-container">
      <div className="success-header">
        <svg className="success-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <h3 className="success-title">{title}</h3>
      </div>
      <p className="success-message">{message}</p>
    </div>
  );
};

// Default export for convenience
const Components = {
  LoadingSpinner,
  ErrorMessage,
  SuccessMessage
};

export default Components;