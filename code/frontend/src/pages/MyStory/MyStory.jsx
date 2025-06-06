
import React, { useState } from 'react';
import { Book, Play, Calendar, User, MapPin, Sparkles, Search, Filter, Trash2, Eye } from 'lucide-react';
import './MyStory.css';
import { useNavigate } from 'react-router-dom';

const StoryListPage = ({ 
  stories = [], 
  onStorySelect, 
  onDeleteStory, 
  loading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, title
  const [filteredStories, setFilteredStories] = useState([]);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="story-list-container">
        <div className="story-list-loading">
          <Sparkles className="loading-icon" />
          <p>Loading your magical stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="story-list-container">
      <div className="story-list-header">
        <div className="header-content">
          <h1>
            <Book className="header-icon" />
            Your Story Collection
          </h1>
          <p className="header-subtitle">
            {stories.length} magical {stories.length === 1 ? 'story' : 'stories'} waiting to be explored
          </p>
        </div>
        
        <button 
          className="create-new-btn"
          onClick={()=> { navigate('/generatestory'); 
}}
        >
          <Sparkles size={16} />
          Create New Story
        </button>
      </div>

      <div className="story-list-controls">
        <div className="search-section">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search stories, characters, themes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <Filter className="filter-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {filteredStories.length === 0 ? (
        <div className="empty-state">
          {stories.length === 0 ? (
            <>
              <Book className="empty-icon" />
              <h3>No stories yet</h3>
              <p>Create your first magical story to get started!</p>
              <button 
                className="create-first-story-btn"
                onClick={()=> navigate('/generatestory')}
              >
                <Sparkles size={16} />
                Create Your First Story
              </button>
            </>
          ) : (
            <>
              <Search className="empty-icon" />
              <h3>No stories found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </>
          )}
        </div>
      ) : (
        <div className="stories-grid">
          {filteredStories.map((story) => (
            <div key={story.id} className="story-card">
              <div className="story-card-image">
                {story.imageDownloadUrl ? (
                  <img 
                    src={story.imageDownloadUrl} 
                    alt={story.title || 'Story illustration'} 
                    className="story-thumbnail"
                  />
                ) : (
                  <div className="story-placeholder">
                    <Book className="placeholder-icon" />
                  </div>
                )}
                
                <div className="story-card-overlay">
                  <button
                    onClick={() => onStorySelect(story)}
                    className="story-action-btn primary"
                    title="Read Story"
                  >
                    <Eye size={16} />
                  </button>
                  
                  {story.audioBuffer && (
                    <button
                      onClick={() => onStorySelect(story)}
                      className="story-action-btn secondary"
                      title="Play Audio"
                    >
                      <Play size={16} />
                    </button>
                  )}
                  
                  {onDeleteStory && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this story?')) {
                          onDeleteStory(story.id);
                        }
                      }}
                      className="story-action-btn danger"
                      title="Delete Story"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="story-card-content">
                <h3 className="story-title">
                  {story.title || 'Untitled Story'}
                </h3>
                
                <div className="story-metadata">
                  {story.metadata?.character && (
                    <div className="metadata-item">
                      <User size={12} />
                      <span>{story.metadata.character}</span>
                    </div>
                  )}
                  
                  {story.metadata?.setting && (
                    <div className="metadata-item">
                      <MapPin size={12} />
                      <span>{story.metadata.setting}</span>
                    </div>
                  )}
                  
                  {story.metadata?.theme && (
                    <div className="metadata-item">
                      <Sparkles size={12} />
                      <span>{story.metadata.theme}</span>
                    </div>
                  )}
                </div>

                {story.content && (
                  <p className="story-preview">
                    {truncateText(story.content)}
                  </p>
                )}

                <div className="story-card-footer">
                  <div className="story-date">
                    <Calendar size={12} />
                    <span>{formatDate(story.createdAt)}</span>
                  </div>
                  
                  <div className="story-features">
                    {story.audioBuffer && (
                      <span className="feature-badge audio">
                        <Play size={10} />
                        Audio
                      </span>
                    )}
                    {story.imageDownloadUrl && (
                      <span className="feature-badge image">
                        <Eye size={10} />
                        Image
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredStories.length > 0 && (
        <div className="story-list-summary">
          <p>
            Showing {filteredStories.length} of {stories.length} stories
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      )}
    </div>
  );
};

export default StoryListPage;


/** @ai-generated 
Basic structure of the component was AI generated
Tool: Claude (Anthropic)
Link: https://claude.ai/chat/3ec44bc7-3ce2-4e0f-9600-f909671b1292
Prompt: "Create a React component for displaying a list of user stories 
with search, filter, and sort functionality. 
The component should include a header with the number of stories, 
a search bar, and options to filter by character, theme, and setting. 
Each story card should display the title, metadata (character, theme, setting),
creation date, and an image if available. Include buttons for reading the story,
playing audio if available, and deleting the story. Ensure the UI is clean and user-friendly."
/*
Modified by:  Hongjie Zhang
Modifications: Fix nav link, add margin to the header, add loading state,
add empty state when no stories are available,
Verified:  Reviewed, partially edited*/

