import React from 'react';
import './StoryLoadingScreen.css';

const StoryLoadingAnimation = ({ 
  isLoadingStory, 
  isStoryComplete, 
  isLoadingImage, 
  isImageComplete, 
  isLoadingAudio, 
  isAudioComplete 
}) => {
  const LoadingStep = ({ icon: Icon, title, isLoading, isComplete, delay = 0 }) => {
    const getStatus = () => {
      if (isComplete) return 'complete';
      if (isLoading) return 'loading';
      return 'pending';
    };

    const status = getStatus();

    return (
      <div 
        className={`loading-step ${status}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className={`step-icon-wrapper ${status === 'loading' ? 'pulsing' : ''}`}>
          {status === 'loading' ? (
            <div className="loader-icon spinning">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
          ) : status === 'complete' ? (
            <div className="check-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
          ) : (
            <div className="default-icon">
              <Icon />
            </div>
          )}
        </div>
        
        <div className="step-content">
          <h3 className={`step-title ${status}`}>
            {title}
          </h3>
          <div className="progress-wrapper">
            <div className="progress-bar">
              <div className={`progress-fill ${status}`}></div>
            </div>
          </div>
        </div>

        <div className={`step-status ${status}`}>
          {status === 'complete' ? 'Complete' : 
           status === 'loading' ? 'Loading...' : 'Waiting'}
        </div>
      </div>
    );
  };

  // Custom SVG Icons
  const BookIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );

  const ImageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21,15 16,10 5,21"></polyline>
    </svg>
  );

  const VolumeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
  );

  const getSubtitleText = () => {
    if (isStoryComplete) return 'Story generation complete!';
    if (isLoadingStory) return 'Creating your magical story...';
    if (isLoadingImage || isLoadingAudio) return 'Adding magical touches...';
    return 'Preparing your story...';
  };

  return (
    <div className="story-loading-wrapper">
      {/* Magical Sparkle Background */}
      <div className="sparkle-container">
        {Array.from({ length: 25 }).map((_, i) => {
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const delay = (Math.random() * 3).toFixed(1);
          return (
            <div
              key={i}
              className="sparkle"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      <div className="loading-content">
        <div className="header-section">
          <div className="main-icon-container">
            <div className={`main-icon ${
              isStoryComplete ? 'complete' : 'active'
            } ${isLoadingStory || isLoadingImage || isLoadingAudio ? 'bouncing' : ''}`}>
              <BookIcon />
            </div>
          </div>
          <h2 className="main-heading">
            Generating Your Story
          </h2>
          <p className="main-description">
            {getSubtitleText()}
          </p>
        </div>

        <div className="steps-container">
          <LoadingStep
            icon={BookIcon}
            title="Story Content"
            isLoading={isLoadingStory}
            isComplete={!isLoadingStory && !isLoadingImage && !isLoadingAudio}
          />
          
          <LoadingStep
            icon={ImageIcon}
            title="Story Illustration"
            isLoading={isLoadingImage}
            isComplete={isImageComplete}
            delay={100}
          />
          
          <LoadingStep
            icon={VolumeIcon}
            title="Audio Narration"
            isLoading={isLoadingAudio}
            isComplete={isAudioComplete}
            delay={200}
          />
        </div>

        {isStoryComplete && (
          <div className="completion-banner">
            <div className="completion-content">
              <div className="completion-check-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
              </div>
              <span className="completion-text">Story Ready!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryLoadingAnimation;