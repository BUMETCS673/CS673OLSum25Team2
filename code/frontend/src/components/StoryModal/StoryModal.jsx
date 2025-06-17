import React, { useEffect } from 'react';
import { X, User, MapPin, Sparkles, Calendar, Play, Eye, Volume2 } from 'lucide-react';
import './StoryModal.css';
const StoryModal = ({ story, isOpen, onClose, onNext, onPrevious }) => {

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render if not open or no story
  if (!isOpen || !story) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="story-modal-overlay" onClick={onClose}>
      <div className="story-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="story-modal-header">
          <div className="story-modal-title-section">
            <h2>{story.title || 'Untitled Story'}</h2>
            <div className="story-modal-date">
              <Calendar size={16} />
              <span>{formatDate(story.createdAt)}</span>
            </div>
          </div>
          
          <div className="story-modal-controls">
            {onPrevious && (
              <button 
                onClick={onPrevious}
                className="story-modal-nav-btn"
                title="Previous Story"
              >
                ←
              </button>
            )}
            
            {onNext && (
              <button 
                onClick={onNext}
                className="story-modal-nav-btn"
                title="Next Story"
              >
                →
              </button>
            )}
            
            <button 
              onClick={onClose}
              className="story-modal-close"
              title="Close Modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="story-modal-content">
          {/* Story Image */}
          {story.imageUrl && (
            <div className="story-modal-image-container">
              <img 
                src={story.imageUrl} 
                alt={story.title || 'Story illustration'}
                className="story-modal-image"
              />
            </div>
          )}

    
          {/* Story Details */}
          <div className="story-modal-text">
            {/* Story Metadata */}
            {(story.character || story.setting || story.theme) && (
              <div className="story-modal-meta">
                {story.character && (
                  <div className="story-modal-meta-item">
                    <User size={16} />
                    <span>{Array.isArray(story.character) ? story.character.join(', ') : story.character}</span>
                  </div>
                )}
                
                {story.setting && (
                  <div className="story-modal-meta-item">
                    <MapPin size={16} />
                    <span>{Array.isArray(story.setting) ? story.setting.join(', ') : story.setting}</span>
                  </div>
                )}
                
                {story.theme && (
                  <div className="story-modal-meta-item">
                    <Sparkles size={16} />
                    <span>{Array.isArray(story.theme) ? story.theme.join(', ') : story.theme}</span>
                  </div>
                )}
              </div>
            )}

            {/* Audio Player */}
            {story.audioUrl && (
              <div className="story-modal-audio-section">
                <div className="story-modal-audio-header">
                  <Volume2 size={20} />
                  <h4>Listen to Story</h4>
                </div>
                <audio 
                  key={story.id || story.audioUrl} // Add key to force re-render
                  controls 
                  className="story-modal-audio"
                  preload="metadata"
                >
                  <source src={story.audioUrl} type="audio/mp3" />
                  <source src={story.audioUrl} type="audio/mpeg" />
                  <source src={story.audioUrl} type="audio/wav" />
                  <source src={story.audioUrl} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            
            {/* Story Content */}
            {story.content && (
              <div className="story-modal-story-content">
                <h3>Story</h3>
                <div className="story-modal-story-text">
                  {story.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
            
          
            
            {/* Story Features */}
            <div className="story-modal-features">
              {story.audioUrl && (
                <span className="story-modal-feature-badge audio">
                  <Play size={12} />
                  Audio Available
                </span>
              )}
              {story.imageUrl && (
                <span className="story-modal-feature-badge image">
                  <Sparkles size={12} />
                  Illustrated
                </span>
              )}
              {story.isSaved && (
                <span className="story-modal-feature-badge saved">
                  ♥ Saved
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;