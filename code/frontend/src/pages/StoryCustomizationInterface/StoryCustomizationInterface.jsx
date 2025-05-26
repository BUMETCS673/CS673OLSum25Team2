import React from 'react';
import './StoryCustomizationInterface.css';

const StoryCustomizationInterface = () => {
  return (
    <div className="story-container">
      <div className="story-panel">
        <div className="story-row">
          <p>Choose a character</p>
          <div className="story-options">
            <button className="story-option">Jack</button>
            <button className="story-option">Jill</button>
            <button className="story-option">Big Bad Wolf</button>
          </div>
        </div>

        <div className="story-row">
          <p>Choose a theme</p>
          <div className="story-options">
            <button className="story-option">Fantasy</button>
            <button className="story-option">Sci-Fi</button>
            <button className="story-option">Mystery</button>
          </div>
        </div>

        <div className="story-row">
          <p>Choose a setting</p>
          <div className="story-options">
            <button className="story-option">Forest</button>
            <button className="story-option">Space Station</button>
            <button className="story-option">Haunted House</button>
          </div>
        </div>
      </div>

      <button className="generate-btn">Generate a Story</button>
    </div>
  );
};

export default StoryCustomizationInterface;
