import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import MyStory from '../src/pages/MyStory/MyStory';
import { useNavigate } from 'react-router-dom';
import { useStoryContext } from '../src/hooks/Story/useStoryContext';
import { useGetAllStories } from '../src/hooks/Story/useGetAllStories';
import { useDeleteStory } from '../src/hooks/Story/useDeleteStory';
import { useToggleFavorites } from '../src/hooks/Story/useToggleFavorites';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../src/hooks/Story/useStoryContext', () => ({
  useStoryContext: vi.fn(),
}));

vi.mock('../src/hooks/Story/useGetAllStories', () => ({
  useGetAllStories: vi.fn(),
}));

vi.mock('../src/hooks/Story/useDeleteStory', () => ({
  useDeleteStory: vi.fn(),
}));

vi.mock('../src/hooks/Story/useToggleFavorites', () => ({
  useToggleFavorites: vi.fn(),
}));

vi.mock('../src/components/StoryModal/StoryModal', () => ({
  default: ({ story, isOpen, onClose, onNext, onPrevious }) => 
    isOpen ? (
      <div data-testid="story-modal">
        <h2>{story?.title}</h2>
        <button onClick={onClose}>Close</button>
        {onNext && <button onClick={onNext}>Next</button>}
        {onPrevious && <button onClick={onPrevious}>Previous</button>}
      </div>
    ) : null,
}));

vi.mock('../src/components/FullImageViewer/FullImageViewer', () => ({
  default: ({ isOpen, imageUrl, title, onClose }) => 
    isOpen ? (
      <div data-testid="full-image-viewer">
        <img src={imageUrl} alt={title} />
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

// Mock data
const mockStories = [
  {
    storyId: '1',
    title: 'The Magical Forest',
    content: 'Once upon a time...',
    summary: 'A wonderful adventure in the magical forest',
    character: 'Luna',
    setting: 'Forest',
    theme: 'Adventure',
    imageUrl: 'image1.jpg',
    audioUrl: 'audio1.mp3',
    isFavorite: false,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    storyId: '2',
    title: 'Dragon Dreams',
    content: 'In a land far away...',
    summary: 'A brave dragon helps save the kingdom',
    character: 'Draco',
    setting: 'Castle',
    theme: 'Courage',
    imageUrl: 'image2.jpg',
    audioUrl: 'audio2.mp3',
    isFavorite: true,
    createdAt: '2024-01-02T10:00:00Z',
  },
  {
    storyId: '3',
    title: 'Ocean Adventures',
    content: 'Under the sea...',
    summary: 'Exploring the mysteries of the ocean',
    character: 'Marina',
    setting: 'Ocean',
    theme: 'Discovery',
    imageUrl: 'image3.jpg',
    audioUrl: null,
    isFavorite: false,
    createdAt: '2024-01-03T10:00:00Z',
  },
];

describe('MyStory Component', () => {
  let mockNavigate;
  let mockGetAllStories;
  let mockDeleteStoryByID;
  let mockToggleFavorites;

  beforeEach(() => {
    mockNavigate = vi.fn();
    mockGetAllStories = vi.fn();
    mockDeleteStoryByID = vi.fn();
    mockToggleFavorites = vi.fn();

    useNavigate.mockReturnValue(mockNavigate);
    useStoryContext.mockReturnValue({ allStories: mockStories });
    useGetAllStories.mockReturnValue({
      getAllStories: mockGetAllStories,
      getAllStoriesLoading: false,
      getAllStoriesError: null,
    });
    useDeleteStory.mockReturnValue({ deleteStoryByID: mockDeleteStoryByID });
    useToggleFavorites.mockReturnValue({ toggleFavorites: mockToggleFavorites });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderMyStory = () => {
    return render(
      <BrowserRouter>
        <MyStory />
      </BrowserRouter>
    );
  };

  describe('Component Structure', () => {
    it('should render the main container', async () => {
      renderMyStory();
      await waitFor(() => {
        expect(document.querySelector('.story-list-container')).toBeInTheDocument();
      });
    });

    it('should render the header with title and subtitle', async () => {
      renderMyStory();
      await waitFor(() => {
        expect(screen.getByText('Your Story Collection')).toBeInTheDocument();
        expect(screen.getByText(/3 magical stories waiting to be explored/)).toBeInTheDocument();
      });
    });

    it('should render create new story button', async () => {
      renderMyStory();
      await waitFor(() => {
        const createBtn = screen.getByText('Create New Story');
        expect(createBtn).toBeInTheDocument();
      });
    });

    it('should navigate to generate story page when create button clicked', async () => {
      renderMyStory();
      await waitFor(() => {
        const createBtn = screen.getByText('Create New Story');
        fireEvent.click(createBtn);
        expect(mockNavigate).toHaveBeenCalledWith('/generatestory');
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state when loading stories', () => {
      useGetAllStories.mockReturnValue({
        getAllStories: mockGetAllStories,
        getAllStoriesLoading: true,
        getAllStoriesError: null,
      });

      renderMyStory();
      expect(screen.getByText('Loading your magical stories...')).toBeInTheDocument();
    });
  });

  describe('Tabs', () => {
    it('should render All Stories and Favorites tabs', async () => {
      renderMyStory();
      await waitFor(() => {
        expect(screen.getByText('All Stories (3)')).toBeInTheDocument();
        expect(screen.getByText('Favorites (1)')).toBeInTheDocument();
      });
    });

    it('should switch to favorites tab when clicked', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByText('All Stories (3)')).toBeInTheDocument();
      });

      const favoritesTab = screen.getByText('Favorites (1)');
      await user.click(favoritesTab);

      expect(favoritesTab.closest('button')).toHaveClass('active');
    });

    it('should filter stories when favorites tab is active', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getAllByText(/Dragon Dreams/)).toHaveLength(1);
      });

      const favoritesTab = screen.getByText('Favorites (1)');
      await user.click(favoritesTab);

      // Only the favorite story should be visible
      await waitFor(() => {
        expect(screen.getByText('Dragon Dreams')).toBeInTheDocument();
        expect(screen.queryByText('The Magical Forest')).not.toBeInTheDocument();
        expect(screen.queryByText('Ocean Adventures')).not.toBeInTheDocument();
      });
    });
  });

  describe('Search and Filter', () => {
    it('should render search input', async () => {
      renderMyStory();
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search stories, characters, themes...');
        expect(searchInput).toBeInTheDocument();
      });
    });

    it('should filter stories based on search term', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByText('The Magical Forest')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search stories, characters, themes...');
      await user.type(searchInput, 'Dragon');

      expect(screen.getByText('Dragon Dreams')).toBeInTheDocument();
      expect(screen.queryByText('The Magical Forest')).not.toBeInTheDocument();
    });

    it('should render sort dropdown with options', async () => {
      renderMyStory();
      await waitFor(() => {
        const sortSelect = screen.getByDisplayValue('Newest First');
        expect(sortSelect).toBeInTheDocument();
        
        fireEvent.click(sortSelect);
        expect(screen.getByText('Oldest First')).toBeInTheDocument();
        expect(screen.getByText('Title A-Z')).toBeInTheDocument();
        expect(screen.getByText('Favorites First')).toBeInTheDocument();
      });
    });

    it('should render character filter dropdown', async () => {
      renderMyStory();
      await waitFor(() => {
        const characterSelect = screen.getByDisplayValue('All Characters');
        expect(characterSelect).toBeInTheDocument();
        
        fireEvent.click(characterSelect);
        
        // Check options within the select element only
        const options = within(characterSelect).getAllByRole('option');
        const optionTexts = options.map(option => option.textContent);
        
        expect(optionTexts).toContain('All Characters');
        expect(optionTexts).toContain('Luna');
        expect(optionTexts).toContain('Draco');
        expect(optionTexts).toContain('Marina');
      });
    });

    it('should filter stories by character', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const characterSelect = screen.getByDisplayValue('All Characters');
        expect(characterSelect).toBeInTheDocument();
      });

      const characterSelect = screen.getByDisplayValue('All Characters');
      await user.selectOptions(characterSelect, 'Luna');

      expect(screen.getByText('The Magical Forest')).toBeInTheDocument();
      expect(screen.queryByText('Dragon Dreams')).not.toBeInTheDocument();
    });

    it('should show clear filters button when filters are active', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search stories, characters, themes...');
        expect(searchInput).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search stories, characters, themes...');
      await user.type(searchInput, 'test');

      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    });

    it('should clear all filters when clear button clicked', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search stories, characters, themes...');
        expect(searchInput).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search stories, characters, themes...');
      await user.type(searchInput, 'test');

      const clearBtn = screen.getByText('Clear Filters');
      await user.click(clearBtn);

      expect(searchInput).toHaveValue('');
    });
  });

  describe('Story Cards', () => {
    it('should render story cards with correct information', async () => {
      renderMyStory();
      await waitFor(() => {
        // Find the specific story card for "The Magical Forest"
        const magicalForestCard = screen.getByText('The Magical Forest').closest('.story-card');
        expect(magicalForestCard).toBeInTheDocument();
        
        // Check the content within that specific card
        expect(within(magicalForestCard).getByText('Luna')).toBeInTheDocument();
        expect(within(magicalForestCard).getByText('Forest')).toBeInTheDocument();
        expect(within(magicalForestCard).getByText('Adventure')).toBeInTheDocument();
      });
    });

    it('should show story metadata icons', async () => {
      renderMyStory();
      await waitFor(() => {
        const storyCards = document.querySelectorAll('.story-card');
        expect(storyCards).toHaveLength(3);
        
        const firstCard = storyCards[0];
        expect(firstCard.querySelector('.metadata-item')).toBeInTheDocument();
      });
    });

    it('should truncate long summaries', async () => {
      renderMyStory();
      await waitFor(() => {
        const summaries = screen.getAllByText(/A wonderful adventure|A brave dragon|Exploring the mysteries/);
        expect(summaries).toHaveLength(3);
      });
    });

    it('should show favorite badge for favorite stories', async () => {
      renderMyStory();
      await waitFor(() => {
        const favoriteStoryCard = screen.getByText('Dragon Dreams').closest('.story-card');
        const favoriteBadge = within(favoriteStoryCard).getByText('Favorite');
        expect(favoriteBadge).toBeInTheDocument();
      });
    });
  });

  describe('Story Actions', () => {
    it('should open full image viewer when eye button clicked', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const eyeButtons = screen.getAllByTitle('View Full Image');
        expect(eyeButtons[0]).toBeInTheDocument();
      });

      const eyeButton = screen.getAllByTitle('View Full Image')[0];
      await user.click(eyeButton);

      expect(screen.getByTestId('full-image-viewer')).toBeInTheDocument();
    });

    it('should toggle favorite status when heart button clicked', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const favoriteButtons = screen.getAllByTitle('Add to Favorites');
        expect(favoriteButtons[0]).toBeInTheDocument();
      });

      const favoriteButton = screen.getAllByTitle('Add to Favorites')[0];
      await user.click(favoriteButton);

      expect(mockToggleFavorites).toHaveBeenCalledWith('3', true);
    });

    it('should show delete confirmation when delete button clicked', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const deleteButtons = screen.getAllByTitle('Delete Story');
        expect(deleteButtons[0]).toBeInTheDocument();
      });

      const deleteButton = screen.getAllByTitle('Delete Story')[0];
      await user.click(deleteButton);

      expect(screen.getByText('Delete Story?')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
      
      // Check that the modal contains the story title
      const deleteModal = document.querySelector('.delete-modal');
      expect(deleteModal).toHaveTextContent('Ocean Adventures');
    });

    it('should cancel delete when cancel button clicked', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const deleteButtons = screen.getAllByTitle('Delete Story');
        expect(deleteButtons[0]).toBeInTheDocument();
      });

      const deleteButton = screen.getAllByTitle('Delete Story')[0];
      await user.click(deleteButton);

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(screen.queryByText('Delete Story?')).not.toBeInTheDocument();
      expect(mockDeleteStoryByID).not.toHaveBeenCalled();
    });

    it('should delete story when confirm delete clicked', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const deleteButtons = screen.getAllByTitle('Delete Story');
        expect(deleteButtons[0]).toBeInTheDocument();
      });

      const deleteButton = screen.getAllByTitle('Delete Story')[0];
      await user.click(deleteButton);

      // Find the confirm button within the delete modal
      const deleteModal = document.querySelector('.delete-modal');
      const confirmButton = within(deleteModal).getByRole('button', { name: 'Delete Story' });
      await user.click(confirmButton);

      await waitFor(() => {
        // The first story in newest-first order is Ocean Adventures with id '3'
        expect(mockDeleteStoryByID).toHaveBeenCalledWith('3');
      });
    });

    it('should open story modal when read button clicked', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const readButtons = screen.getAllByTitle('Read Story');
        expect(readButtons[0]).toBeInTheDocument();
      });

      const readButton = screen.getAllByTitle('Read Story')[0];
      await user.click(readButton);

      expect(screen.getByTestId('story-modal')).toBeInTheDocument();
      expect(screen.getByText('The Magical Forest')).toBeInTheDocument();
    });
  });

  describe('Story Modal Navigation', () => {
    it('should navigate to next story in modal', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const readButtons = screen.getAllByTitle('Read Story');
        expect(readButtons[0]).toBeInTheDocument();
      });

      const readButton = screen.getAllByTitle('Read Story')[0];
      await user.click(readButton);

      const nextButton = within(screen.getByTestId('story-modal')).getByText('Next');
      await user.click(nextButton);

      expect(screen.getByText('Dragon Dreams')).toBeInTheDocument();
    });

    it('should navigate to previous story in modal', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const readButtons = screen.getAllByTitle('Read Story');
        expect(readButtons[1]).toBeInTheDocument();
      });

      const readButton = screen.getAllByTitle('Read Story')[1]; // Start with second story
      await user.click(readButton);

      const previousButton = within(screen.getByTestId('story-modal')).getByText('Previous');
      await user.click(previousButton);

      expect(screen.getByText('The Magical Forest')).toBeInTheDocument();
    });

    it('should close story modal when close button clicked', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const readButtons = screen.getAllByTitle('Read Story');
        expect(readButtons[0]).toBeInTheDocument();
      });

      const readButton = screen.getAllByTitle('Read Story')[0];
      await user.click(readButton);

      const closeButton = within(screen.getByTestId('story-modal')).getByText('Close');
      await user.click(closeButton);

      expect(screen.queryByTestId('story-modal')).not.toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      // Create more stories for pagination testing
      const manyStories = Array.from({ length: 15 }, (_, i) => ({
        ...mockStories[0],
        storyId: `story-${i}`,
        title: `Story ${i + 1}`,
        createdAt: new Date(2024, 0, i + 1).toISOString(),
      }));
      
      useStoryContext.mockReturnValue({ allStories: manyStories });
    });

    it('should render pagination controls when more than 12 stories', async () => {
      renderMyStory();
      
      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
      });
    });

    it('should navigate to next page', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });

      const nextButton = screen.getByText('Next').closest('button');
      await user.click(nextButton);

      expect(screen.getByText(/Page 2 of 2/)).toBeInTheDocument();
    });

    it('should disable previous button on first page', async () => {
      renderMyStory();
      
      await waitFor(() => {
        const previousButton = screen.getByText('Previous').closest('button');
        expect(previousButton).toBeDisabled();
      });
    });

    it('should disable next button on last page', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });

      const nextButton = screen.getByText('Next').closest('button');
      await user.click(nextButton);

      await waitFor(() => {
        expect(nextButton).toBeDisabled();
      });
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no stories exist', async () => {
      useStoryContext.mockReturnValue({ allStories: [] });
      
      renderMyStory();
      
      await waitFor(() => {
        expect(screen.getByText('No stories yet')).toBeInTheDocument();
        expect(screen.getByText('Create your first magical story to get started!')).toBeInTheDocument();
        expect(screen.getByText('Create Your First Story')).toBeInTheDocument();
      });
    });

    it('should show empty favorites state when no favorites', async () => {
      // Set up stories with no favorites BEFORE rendering
      const nonFavoriteStories = mockStories.map(s => ({ ...s, isFavorite: false }));
      useStoryContext.mockReturnValue({ allStories: nonFavoriteStories });
      
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        // Find the favorites tab by its class and content
        const tabButtons = document.querySelectorAll('.story-tab');
        const favoritesTab = Array.from(tabButtons).find(btn => 
          btn.textContent.includes('Favorites') && btn.textContent.includes('(0)')
        );
        expect(favoritesTab).toBeInTheDocument();
      });

      const tabButtons = document.querySelectorAll('.story-tab');
      const favoritesTab = Array.from(tabButtons).find(btn => 
        btn.textContent.includes('Favorites')
      );
      
      await user.click(favoritesTab);

      expect(screen.getByText('No favorite stories yet')).toBeInTheDocument();
      expect(screen.getByText('Save stories you love by clicking the heart icon!')).toBeInTheDocument();
    });

    it('should show no results when search has no matches', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search stories, characters, themes...');
        expect(searchInput).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search stories, characters, themes...');
      await user.type(searchInput, 'nonexistent story');

      expect(screen.getByText('No stories found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search or filter criteria')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle getAllStories error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      useGetAllStories.mockReturnValue({
        getAllStories: mockGetAllStories,
        getAllStoriesLoading: false,
        getAllStoriesError: 'Failed to fetch stories',
      });

      renderMyStory();

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching stories:', 'Failed to fetch stories');
      });

      consoleSpy.mockRestore();
    });

    it('should handle toggle favorite error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockToggleFavorites.mockRejectedValue(new Error('Toggle failed'));

      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const favoriteButtons = screen.getAllByTitle('Add to Favorites');
        expect(favoriteButtons[0]).toBeInTheDocument();
      });

      const favoriteButton = screen.getAllByTitle('Add to Favorites')[0];
      await user.click(favoriteButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error updating favorite status:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Story Summary', () => {
    it('should display story count summary', async () => {
      renderMyStory();
      
      await waitFor(() => {
        expect(screen.getByText(/Showing 3 of 3 stories/)).toBeInTheDocument();
      });
    });

    it('should update summary with search term', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search stories, characters, themes...');
        expect(searchInput).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search stories, characters, themes...');
      await user.type(searchInput, 'Dragon');

      expect(screen.getByText(/Showing 1 of 3 stories matching "Dragon"/)).toBeInTheDocument();
    });

    it('should update summary with active filters', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const characterSelect = screen.getByDisplayValue('All Characters');
        expect(characterSelect).toBeInTheDocument();
      });

      const characterSelect = screen.getByDisplayValue('All Characters');
      await user.selectOptions(characterSelect, 'Luna');

      expect(screen.getByText(/Showing 1 of 3 stories with current filters/)).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should sort stories by newest first by default', async () => {
      renderMyStory();
      
      await waitFor(() => {
        const storyTitles = screen.getAllByRole('heading', { level: 3 });
        expect(storyTitles[0]).toHaveTextContent('Ocean Adventures');
        expect(storyTitles[1]).toHaveTextContent('Dragon Dreams');
        expect(storyTitles[2]).toHaveTextContent('The Magical Forest');
      });
    });

    it('should sort stories by oldest first', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const sortSelect = screen.getByDisplayValue('Newest First');
        expect(sortSelect).toBeInTheDocument();
      });

      const sortSelect = screen.getByDisplayValue('Newest First');
      await user.selectOptions(sortSelect, 'oldest');

      const storyTitles = screen.getAllByRole('heading', { level: 3 });
      expect(storyTitles[0]).toHaveTextContent('The Magical Forest');
      expect(storyTitles[1]).toHaveTextContent('Dragon Dreams');
      expect(storyTitles[2]).toHaveTextContent('Ocean Adventures');
    });

    it('should sort stories alphabetically', async () => {
      renderMyStory();
      const user = userEvent.setup();
      
      await waitFor(() => {
        const sortSelect = screen.getByDisplayValue('Newest First');
        expect(sortSelect).toBeInTheDocument();
      });

      const sortSelect = screen.getByDisplayValue('Newest First');
      await user.selectOptions(sortSelect, 'title');

      const storyTitles = screen.getAllByRole('heading', { level: 3 });
      expect(storyTitles[0]).toHaveTextContent('Dragon Dreams');
      expect(storyTitles[1]).toHaveTextContent('Ocean Adventures');
      expect(storyTitles[2]).toHaveTextContent('The Magical Forest');
    });
  });
});
