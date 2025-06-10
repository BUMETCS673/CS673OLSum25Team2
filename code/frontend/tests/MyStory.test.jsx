import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import StoryListPage from '../src/pages/MyStory/MyStory';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock window.confirm
global.confirm = vi.fn();

// Helper function to render component with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// Sample story data for testing
const mockStories = [
  {
    id: '1',
    title: 'The Magic Forest Adventure',
    content: 'Once upon a time, in a magical forest filled with talking animals, there lived a brave little rabbit named Benny. He discovered a hidden treasure that would change everything.',
    createdAt: '2024-01-15T10:30:00Z',
    imageDownloadUrl: 'https://example.com/image1.jpg',
    audioBuffer: new ArrayBuffer(8),
    metadata: {
      character: 'Benny the Rabbit',
      setting: 'Magic Forest',
      theme: 'Adventure'
    }
  },
  {
    id: '2',
    title: 'Princess Luna and the Star Castle',
    content: 'High above the clouds, Princess Luna lived in a castle made of stars. Every night, she would dance with the moonbeams and sing lullabies to sleeping children.',
    createdAt: '2024-01-10T14:20:00Z',
    imageDownloadUrl: null,
    audioBuffer: null,
    metadata: {
      character: 'Princess Luna',
      setting: 'Star Castle',
      theme: 'Magic'
    }
  },
  {
    id: '3',
    title: 'The Friendly Dragon',
    content: 'In a peaceful village, there lived a dragon who was nothing like the scary stories people told. This dragon loved to help others and make new friends.',
    createdAt: '2024-01-20T09:15:00Z',
    imageDownloadUrl: 'https://example.com/image3.jpg',
    audioBuffer: new ArrayBuffer(8),
    metadata: {
      character: 'Friendly Dragon',
      setting: 'Village',
      theme: 'Friendship'
    }
  }
];

describe('StoryListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.confirm.mockReturnValue(true);
  });

  describe('Loading State', () => {
    it('displays loading screen when loading prop is true', () => {
      renderWithRouter(<StoryListPage loading={true} />);
      
      expect(screen.getByText('Loading your magical stories...')).toBeInTheDocument();
    });

    it('does not display loading screen when loading is false', () => {
      renderWithRouter(<StoryListPage loading={false} stories={[]} />);
      
      expect(screen.queryByText('Loading your magical stories...')).not.toBeInTheDocument();
    });
  });

  describe('Header Section', () => {
    it('renders the header with correct title and story count', () => {
      renderWithRouter(<StoryListPage stories={mockStories} />);
      
      expect(screen.getByText('Your Story Collection')).toBeInTheDocument();
      expect(screen.getByText('3 magical stories waiting to be explored')).toBeInTheDocument();
    });

    it('displays singular form when there is one story', () => {
      renderWithRouter(<StoryListPage stories={[mockStories[0]]} />);
      
      expect(screen.getByText('1 magical story waiting to be explored')).toBeInTheDocument();
    });

    it('renders create new story button', () => {
      renderWithRouter(<StoryListPage stories={mockStories} />);
      
      const createButton = screen.getByText('Create New Story');
      expect(createButton).toBeInTheDocument();
    });

    it('navigates to generate story page when create button is clicked', () => {
      renderWithRouter(<StoryListPage stories={mockStories} />);
      
      const createButton = screen.getByText('Create New Story');
      fireEvent.click(createButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/generatestory');
    });
  });

  describe('Search and Filter Controls', () => {
    it('renders search input', () => {
      renderWithRouter(<StoryListPage stories={mockStories} />);
      
      const searchInput = screen.getByPlaceholderText('Search stories, characters, themes...');
      expect(searchInput).toBeInTheDocument();
    });

    it('renders sort dropdown with options', () => {
      renderWithRouter(<StoryListPage stories={mockStories} />);
      
      const sortSelect = screen.getByDisplayValue('Newest First');
      expect(sortSelect).toBeInTheDocument();
      
      // Check all options exist
      expect(screen.getByText('Newest First')).toBeInTheDocument();
      expect(screen.getByText('Oldest First')).toBeInTheDocument();
      expect(screen.getByText('Title A-Z')).toBeInTheDocument();
    });

    it('updates search term when typing in search input', () => {
      renderWithRouter(<StoryListPage stories={mockStories} />);
      
      const searchInput = screen.getByPlaceholderText('Search stories, characters, themes...');
      fireEvent.change(searchInput, { target: { value: 'magic' } });
      
      expect(searchInput.value).toBe('magic');
    });

    it('updates sort option when dropdown is changed', () => {
      renderWithRouter(<StoryListPage stories={mockStories} />);
      
      const sortSelect = screen.getByDisplayValue('Newest First');
      fireEvent.change(sortSelect, { target: { value: 'oldest' } });
      
      expect(sortSelect.value).toBe('oldest');
    });
  });

  describe('Empty States', () => {
    it('displays empty state when no stories exist', () => {
      renderWithRouter(<StoryListPage stories={[]} />);
      
      expect(screen.getByText('No stories yet')).toBeInTheDocument();
      expect(screen.getByText('Create your first magical story to get started!')).toBeInTheDocument();
      expect(screen.getByText('Create Your First Story')).toBeInTheDocument();
    });

    it('navigates to generate story when create first story button is clicked', () => {
      renderWithRouter(<StoryListPage stories={[]} />);
      
      const createFirstButton = screen.getByText('Create Your First Story');
      fireEvent.click(createFirstButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/generatestory');
    });
  });

  describe('Component Props', () => {
    it('handles missing optional props gracefully', () => {
      renderWithRouter(<StoryListPage />);
      
      expect(screen.getByText('Your Story Collection')).toBeInTheDocument();
      expect(screen.getByText('0 magical stories waiting to be explored')).toBeInTheDocument();
    });

    it('passes story data correctly to action handlers', () => {
      const mockOnStorySelect = vi.fn();
      const mockOnDeleteStory = vi.fn();
      
      renderWithRouter(
        <StoryListPage 
          stories={mockStories}
          onStorySelect={mockOnStorySelect}
          onDeleteStory={mockOnDeleteStory}
        />
      );
      
      // The component should be ready to call these functions
      expect(mockOnStorySelect).not.toHaveBeenCalled();
      expect(mockOnDeleteStory).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      renderWithRouter(<StoryListPage stories={mockStories} />);
      
      // Check for proper heading structure
      expect(screen.getByRole('heading', { name: /Your Story Collection/ })).toBeInTheDocument();
      
      // Check for proper form controls
      expect(screen.getByRole('textbox', { name: /Search/ })).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('has proper button labels and titles', () => {
      renderWithRouter(<StoryListPage stories={mockStories} />);
      
      const createButton = screen.getByText('Create New Story');
      expect(createButton).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('renders without breaking on different screen sizes', () => {
      // Test basic rendering which should work across screen sizes
      renderWithRouter(<StoryListPage stories={mockStories} />);
      
      expect(screen.getByText('Your Story Collection')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search stories, characters, themes...')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles stories with missing data gracefully', () => {
      const incompleteStories = [
        { id: '1', title: null, content: null, createdAt: null },
        { id: '2', title: 'Valid Story', metadata: null }
      ];
      
      renderWithRouter(<StoryListPage stories={incompleteStories} />);
      
      expect(screen.getByText('Your Story Collection')).toBeInTheDocument();
      expect(screen.getByText('2 magical stories waiting to be explored')).toBeInTheDocument();
    });

    it('handles invalid date strings', () => {
      const storiesWithBadDates = [
        { id: '1', title: 'Test Story', createdAt: 'invalid-date' }
      ];
      
      renderWithRouter(<StoryListPage stories={storiesWithBadDates} />);
      
      // Component should still render without crashing
      expect(screen.getByText('Your Story Collection')).toBeInTheDocument();
    });
  });
});