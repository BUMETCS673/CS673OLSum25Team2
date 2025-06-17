import React, { useState, useEffect, useMemo } from "react";
import {
  Book,
  BookOpen,
  Play,
  Calendar,
  User,
  MapPin,
  Sparkles,
  Search,
  Filter,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Heart,
  AlertTriangle,
} from "lucide-react";
import "./MyStory.css";
import { useNavigate } from "react-router-dom";
import StoryModal from "../../components/StoryModal/StoryModal";
import FullImageViewer from "../../components/FullImageViewer/FullImageViewer";
import { useStoryContext } from "../../hooks/Story/useStoryContext";
import { useDeleteStory } from "../../hooks/Story/useDeleteStory";
import { useToggleFavorites } from "../../hooks/Story/useToggleFavorites";
import { useGetAllStories } from "../../hooks/Story/useGetAllStories";

const MyStory = () => {
  // State management
  const [stories, setStories] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState({
    character: "",
    setting: "",
    theme: "",
  });
  const [showFullImage, setShowFullImage] = useState(false);
  const [showFullImageStory, setShowFullImageStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [saving, setSaving] = useState(null); // Track which story is being favorited
  const [deleting, setDeleting] = useState(null); // Track which story is being deleted
  const [activeTab, setActiveTab] = useState("all"); // "all" or "favorites"
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    storyId: null,
    storyTitle: "",
  });

  const { allStories } = useStoryContext();
  const { getAllStories, getAllStoriesLoading, getAllStoriesError } =
    useGetAllStories();
  const { toggleFavorites } = useToggleFavorites();
  const { deleteStoryByID } = useDeleteStory();

  const navigate = useNavigate();
  const storiesPerPage = 12;

  // Fetch stories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllStories();
        setIsInitialized(true);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setIsInitialized(true);
      }
    };

    fetchData();
  }, []);

  // Update local stories when context data changes
  useEffect(() => {
    if (!getAllStoriesLoading && allStories && isInitialized) {
      setStories(allStories);
    }

    if (getAllStoriesError) {
      console.error("Error fetching stories:", getAllStoriesError);
    }
  }, [allStories, getAllStoriesLoading, getAllStoriesError, isInitialized]);

  // Story selection handlers
  const onStorySelect = (story) => {
    console.log(story);
    const storyIndex = filteredAndSortedStories.findIndex(
      (s) => s.storyId === story.storyId
    );

    console.log(storyIndex);
    setSelectedStory(story);
    setSelectedStoryIndex(storyIndex);
    setIsModalOpen(true);
  };

  const closeStoryModal = () => {
    setIsModalOpen(false);
    setSelectedStory(null);
    setSelectedStoryIndex(-1);
  };

  const goToNextStory = () => {
    if (selectedStoryIndex < filteredAndSortedStories.length - 1) {
      const nextIndex = selectedStoryIndex + 1;
      const nextStory = filteredAndSortedStories[nextIndex];
      setSelectedStory(nextStory);
      setSelectedStoryIndex(nextIndex);
    }
  };

  const goToPreviousStory = () => {
    if (selectedStoryIndex > 0) {
      const prevIndex = selectedStoryIndex - 1;
      const prevStory = filteredAndSortedStories[prevIndex];
      setSelectedStory(prevStory);
      setSelectedStoryIndex(prevIndex);
    }
  };


  const toggleFavoriteStory = async (storyId) => {
    try {
  
      setSaving(storyId);
      const story = stories.find((s) => s.storyId === storyId);
      const newFavoriteState = !story.isFavorite;
      console.log(newFavoriteState);
      await toggleFavorites(storyId,newFavoriteState);

      // Update local state to reflect favorite status
      setStories((prev) =>
        prev.map((story) =>
          story.storyId === storyId
            ? { ...story, isFavorite: newFavoriteState }
            : story
        )
      );
    } catch (err) {
      console.error("Error updating favorite status:", err);
    } finally {
      setSaving(null);
    }
  };

  // Delete confirmation handlers
  const showDeleteConfirmation = async (story) => {
    console.log(story.storyId);
    await setDeleteConfirmation({
      isOpen: true,
      storyId: story.storyId,
      storyTitle: story.title || "Untitled Story",
    });
  };

  const hideDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      storyId: null,
      storyTitle: "",
    });
  };

  const confirmDelete = async () => {
    setDeleting(deleteConfirmation.storyId);
    await deleteStoryByID(deleteConfirmation.storyId);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setStories((prev) =>
      prev.filter((story) => story.storyId !== deleteConfirmation.storyId)
    );

    const newTotalPages = Math.ceil((stories.length - 1) / storiesPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }

    hideDeleteConfirmation();
  };

  // Advanced filtering and sorting
  const filteredAndSortedStories = useMemo(() => {
    let filtered = stories.filter((story) => {
      // Tab filtering
      if (activeTab === "favorites" && !story.isFavorite) {
        return false;
      }

      const matchesSearch =
        !searchTerm ||
        story.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.character?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.setting?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.theme?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCharacter =
        !filterBy.character || story?.character === filterBy.character;

      const matchesSetting =
        !filterBy.setting || story?.setting === filterBy.setting;

      const matchesTheme = !filterBy.theme || story?.theme === filterBy.theme;

      return (
        matchesSearch && matchesCharacter && matchesSetting && matchesTheme
      );
    });

    // Sort stories
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "favorites":
          // Favorites first, then by creation date
          if (a.isFavorite && b.isFavorite) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          if (a.isFavorite) return -1;
          if (b.isFavorite) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [stories, searchTerm, sortBy, filterBy, activeTab]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedStories.length / storiesPerPage
  );
  const startIndex = (currentPage - 1) * storiesPerPage;
  const paginatedStories = filteredAndSortedStories.slice(
    startIndex,
    startIndex + storiesPerPage
  );

  // Get unique values for filters
  const uniqueCharacters = [
    ...new Set(stories.map((s) => s.character).filter(Boolean)),
  ];
  const uniqueSettings = [
    ...new Set(stories.map((s) => s.setting).filter(Boolean)),
  ];
  const uniqueThemes = [
    ...new Set(stories.map((s) => s.theme).filter(Boolean)),
  ];

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, filterBy, activeTab]);

  // showFullImage
  const showFullImageHandler = (curStory) => {
    console.log(curStory);
    setShowFullImageStory(curStory);
    setShowFullImage(true);
  };

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterBy({ character: "", setting: "", theme: "" });
    setSortBy("newest");
  };

  // Count favorite stories
  const favoriteStoriesCount = stories.filter(
    (story) => story.isFavorite
  ).length;

  const hasActiveFilters =
    searchTerm || filterBy.character || filterBy.setting || filterBy.theme;

  if (getAllStoriesLoading || !isInitialized) {
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
      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-icon">
              <AlertTriangle size={40} />
            </div>

            <h3 className="delete-modal-title">Delete Story?</h3>

            <p className="delete-modal-text">
              Are you sure you want to delete "
              <strong>{deleteConfirmation.storyTitle}</strong>"? This action
              cannot be undone.
            </p>

            <div className="delete-modal-actions">
              <button
                onClick={hideDeleteConfirmation}
                className="delete-modal-btn cancel"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleting === deleteConfirmation.storyId}
                className={`delete-modal-btn confirm ${
                  deleting === deleteConfirmation.storyId ? "loading" : ""
                }`}
              >
                {deleting === deleteConfirmation.storyId
                  ? "Deleting..."
                  : "Delete Story"}
              </button>
            </div>
          </div>
        </div>
      )}
      <FullImageViewer
        isOpen={showFullImage}
        imageUrl={showFullImageStory?.imageUrl}
        title={showFullImageStory?.title}
        onClose={() => setShowFullImage(false)}
        showControls={true}
        allowDownload={true}
      />

      <StoryModal
        story={selectedStory}
        isOpen={isModalOpen}
        onClose={closeStoryModal}
        onNext={
          selectedStoryIndex < filteredAndSortedStories.length - 1
            ? goToNextStory
            : null
        }
        onPrevious={selectedStoryIndex > 0 ? goToPreviousStory : null}
      />

      <div className="story-list-header">
        <div className="header-content">
          <h1>
            <Book className="header-icon" />
            Your Story Collection
          </h1>
          <p className="header-subtitle">
            {stories.length} magical{" "}
            {stories.length === 1 ? "story" : "stories"} waiting to be explored
          </p>
        </div>

        <button
          className="create-new-btn"
          onClick={() => navigate("/generatestory")}
        >
          <Sparkles size={16} />
          Create New Story
        </button>
      </div>

      {/* Tabs */}
      <div className="story-tabs">
        <button
          onClick={() => setActiveTab("all")}
          className={`story-tab ${activeTab === "all" ? "active" : ""}`}
        >
          <Book size={16} />
          All Stories ({stories.length})
        </button>

        <button
          onClick={() => setActiveTab("favorites")}
          className={`story-tab ${
            activeTab === "favorites" ? "active favorites" : ""
          }`}
        >
          <Heart size={16} />
          Favorites ({favoriteStoriesCount})
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
              <option value="favorites">Favorites First</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={filterBy.character}
              onChange={(e) =>
                setFilterBy((prev) => ({ ...prev, character: e.target.value }))
              }
              className="filter-select"
            >
              <option value="">All Characters</option>
              {uniqueCharacters.map((char) => (
                <option key={char} value={char}>
                  {char}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={filterBy.setting}
              onChange={(e) =>
                setFilterBy((prev) => ({ ...prev, setting: e.target.value }))
              }
              className="filter-select"
            >
              <option value="">All Settings</option>
              {uniqueSettings.map((setting) => (
                <option key={setting} value={setting}>
                  {setting}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={filterBy.theme}
              onChange={(e) =>
                setFilterBy((prev) => ({ ...prev, theme: e.target.value }))
              }
              className="filter-select"
            >
              <option value="">All Themes</option>
              {uniqueThemes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {filteredAndSortedStories.length === 0 ? (
        <div className="empty-state">
          {activeTab === "favorites" ? (
            <>
              <Heart className="empty-icon" />
              <h3>No favorite stories yet</h3>
              <p>Save stories you love by clicking the heart icon!</p>
            </>
          ) : stories.length === 0 ? (
            <>
              <Book className="empty-icon" />
              <h3>No stories yet</h3>
              <p>Create your first magical story to get started!</p>
              <button
                className="create-first-story-btn"
                onClick={() => navigate("/generatestory")}
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
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear All Filters
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="stories-grid">
            {paginatedStories.map((story) => (
              <div key={story.storyId} className="story-card">
                <div className="story-card-image">
                  {story.imageUrl ? (
                    <img
                      src={story.imageUrl}
                      alt={story.title || "Story illustration"}
                      className="story-thumbnail"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="story-placeholder">
                      <Book className="placeholder-icon" />
                    </div>
                  )}

                  <div className="story-card-overlay">
                    <button
                      onClick={() => showFullImageHandler(story)}
                      className="story-action-btn primary"
                      title="View Full Image"
                    >
                      <Eye size={16} />
                    </button>

                    {story.audioUrl && (
                      <button
                        onClick={() => onStorySelect(story)}
                        className="story-action-btn secondary"
                        title="Read Story"
                      >
                        <BookOpen size={16} />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteStory(story.storyId);
                      }}
                      className={`story-action-btn ${
                        story.isFavorite ? "saved" : "save"
                      }`}
                      title={
                        story.isFavorite
                          ? "Remove from Favorites"
                          : "Add to Favorites"
                      }
                      disabled={saving === story.storyId}
                    >
                      <Heart size={14} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showDeleteConfirmation(story);
                      }}
                      className="story-action-btn danger"
                      title="Delete Story"
                      disabled={deleting === story.storyId}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="story-card-content">
                  <h3 className="story-title">
                    {story.title || "Untitled Story"}
                  </h3>

                  <div className="story-metadata">
                    {story.character && (
                      <div className="metadata-item">
                        <User size={12} />
                        <span>{story.character}</span>
                      </div>
                    )}

                    {story.setting && (
                      <div className="metadata-item">
                        <MapPin size={12} />
                        <span>{story.setting}</span>
                      </div>
                    )}

                    {story.theme && (
                      <div className="metadata-item">
                        <Sparkles size={12} />
                        <span>{story.theme}</span>
                      </div>
                    )}
                  </div>

                  {story.summary && (
                    <p className="story-preview" title={story.summary}>
                      {truncateText(story.summary)}
                    </p>
                  )}

                  <div className="story-card-footer">
                    <div className="story-date">
                      <Calendar size={12} />
                      <span>{formatDate(story.createdAt)}</span>
                    </div>

                    <div className="story-features">
                      {story.isFavorite && (
                        <span className="feature-badge saved">
                          <Heart size={10} />
                          Favorite
                        </span>
                      )}
                      {story.audioUrl && (
                        <span className="feature-badge audio">
                          <BookOpen size={10} />
                          Audio
                        </span>
                      )}
                      {story.imageUrl && (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <div className="pagination-info">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <span className="pagination-details">
                  Showing {startIndex + 1}-
                  {Math.min(
                    startIndex + storiesPerPage,
                    filteredAndSortedStories.length
                  )}{" "}
                  of {filteredAndSortedStories.length}
                </span>
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {filteredAndSortedStories.length > 0 && (
        <div className="story-list-summary">
          <p>
            Showing {filteredAndSortedStories.length} of {stories.length}{" "}
            stories
            {searchTerm && ` matching "${searchTerm}"`}
            {hasActiveFilters && ` with current filters`}
            {activeTab === "favorites" && ` in favorites`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyStory;
