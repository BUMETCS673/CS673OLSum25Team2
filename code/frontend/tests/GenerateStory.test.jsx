import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GenerateStory from '../src/pages/GenerateStory/GenerateStory';

// Mock the custom hooks
const mockGenerateStory = vi.fn();
const mockUseGenerateStory = {
  generateStory: mockGenerateStory,
  isLoadingStory: false,
  isStoryComplete: false,
  isLoadingImage: false,
  isImageComplete: false,
  isLoadingAudio: false,
  isAudioComplete: false,
  errorStory: null,
};

const mockUseStoryContext = {
  generatedStory: null,
};

// Mock the components
vi.mock('../src/components/CharacterCarousel/CharacterCarousel', () => ({
  default: ({ onSelect, selected }) => (
    <div data-testid="character-carousel">
      <button 
        onClick={() => onSelect('TestCharacter')}
        className={selected === 'TestCharacter' ? 'selected' : ''}
      >
        Test Character
      </button>
    </div>
  ),
}));

vi.mock('../src/components/StoryRenderingView/StoryRenderingView', () => ({
  default: ({ onBackToSettings, generateStory }) => (
    <div data-testid="story-rendering-view">
      <button onClick={onBackToSettings}>Back to Settings</button>
      <div>Story: {generateStory?.title || 'No story'}</div>
    </div>
  ),
}));

vi.mock('../src/components/StoryLoadingScreen/StoryLoadingScreen', () => ({
  default: ({ isLoadingStory, isStoryComplete, isLoadingImage, isImageComplete, isLoadingAudio, isAudioComplete }) => (
    <div data-testid="story-loading-screen">
      <div>Loading Story: {isLoadingStory.toString()}</div>
      <div>Story Complete: {isStoryComplete.toString()}</div>
      <div>Loading Image: {isLoadingImage.toString()}</div>
      <div>Image Complete: {isImageComplete.toString()}</div>
      <div>Loading Audio: {isLoadingAudio.toString()}</div>
      <div>Audio Complete: {isAudioComplete.toString()}</div>
    </div>
  ),
}));

vi.mock('../src/hooks/Story/useGenerateStory', () => ({
  useGenerateStory: () => mockUseGenerateStory,
}));

vi.mock('../src/hooks/Story/useStoryContext', () => ({
  useStoryContext: () => mockUseStoryContext,
}));

describe('GenerateStory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock values to defaults
    Object.assign(mockUseGenerateStory, {
      generateStory: mockGenerateStory,
      isLoadingStory: false,
      isStoryComplete: false,
      isLoadingImage: false,
      isImageComplete: false,
      isLoadingAudio: false,
      isAudioComplete: false,
      errorStory: null,
    });
    mockUseStoryContext.generatedStory = null;
  });

  describe('Initial Render', () => {
    it('renders the main story container', () => {
      render(<GenerateStory />);
      expect(screen.getByText('Choose your story\'s:')).toBeInTheDocument();
    });

    it('renders all menu buttons', () => {
      render(<GenerateStory />);
      expect(screen.getByText('CHARACTER')).toBeInTheDocument();
      expect(screen.getByText('THEME')).toBeInTheDocument();
      expect(screen.getByText('SETTING')).toBeInTheDocument();
    });

    it('renders character carousel by default', () => {
      render(<GenerateStory />);
      expect(screen.getByTestId('character-carousel')).toBeInTheDocument();
    });

    it('renders generate button as disabled initially', () => {
      render(<GenerateStory />);
      const generateButton = screen.getByText('GENERATE A STORY');
      expect(generateButton).toBeDisabled();
    });
  });

  describe('Menu Navigation', () => {
    it('switches to theme menu when theme button is clicked', () => {
      render(<GenerateStory />);
      
      fireEvent.click(screen.getByText('THEME'));
      
      // Should show theme options
      expect(screen.getByText('Friendship')).toBeInTheDocument();
      expect(screen.getByText('Adventure')).toBeInTheDocument();
      expect(screen.getByText('Magic')).toBeInTheDocument();
    });

    it('switches to setting menu when setting button is clicked', () => {
      render(<GenerateStory />);
      
      fireEvent.click(screen.getByText('SETTING'));
      
      // Should show setting options
      expect(screen.getByText('Forest')).toBeInTheDocument();
      expect(screen.getByText('Castle')).toBeInTheDocument();
      expect(screen.getByText('Space')).toBeInTheDocument();
    });

    it('applies active class to selected menu button', () => {
      render(<GenerateStory />);
      
      const characterButton = screen.getByText('CHARACTER');
      const themeButton = screen.getByText('THEME');
      
      expect(characterButton).toHaveClass('active');
      expect(themeButton).not.toHaveClass('active');
      
      fireEvent.click(themeButton);
      
      expect(characterButton).not.toHaveClass('active');
      expect(themeButton).toHaveClass('active');
    });
  });

  describe('Theme Selection', () => {
    beforeEach(() => {
      render(<GenerateStory />);
      fireEvent.click(screen.getByText('THEME'));
    });

    it('renders all theme options', () => {
      const expectedThemes = [
        'Friendship', 'Adventure', 'Kindness', 'Animals', 'Magic',
        'Helping Others', 'Bravery', 'Imagination', 'Bedtime', 'Learning',
        'Sharing', 'Curiosity', 'Nature', 'Superheroes', 'Creativity'
      ];
      
      expectedThemes.forEach(theme => {
        expect(screen.getByText(theme)).toBeInTheDocument();
      });
    });

    it('selects theme when clicked', () => {
      const friendshipButton = screen.getByText('Friendship');
      
      fireEvent.click(friendshipButton);
      
      expect(friendshipButton).toHaveClass('selected');
    });

    it('deselects previous theme when new one is selected', () => {
      const friendshipButton = screen.getByText('Friendship');
      const adventureButton = screen.getByText('Adventure');
      
      fireEvent.click(friendshipButton);
      expect(friendshipButton).toHaveClass('selected');
      
      fireEvent.click(adventureButton);
      expect(friendshipButton).not.toHaveClass('selected');
      expect(adventureButton).toHaveClass('selected');
    });
  });

  describe('Setting Selection', () => {
    beforeEach(() => {
      render(<GenerateStory />);
      fireEvent.click(screen.getByText('SETTING'));
    });

    it('renders all setting options', () => {
      const expectedSettings = [
        'Forest', 'Castle', 'Underwater', 'Space', 'Playground',
        'Farm', 'City', 'Mountain', 'Pirate Ship', 'Home',
        'Jungle', 'Beach', 'Zoo', 'Tree house', 'Library'
      ];
      
      expectedSettings.forEach(setting => {
        expect(screen.getByText(setting)).toBeInTheDocument();
      });
    });

    it('selects setting when clicked', () => {
      const forestButton = screen.getByText('Forest');
      
      fireEvent.click(forestButton);
      
      expect(forestButton).toHaveClass('selected');
    });
  });

  describe('Character Selection', () => {
    it('renders character carousel', () => {
      render(<GenerateStory />);
      expect(screen.getByTestId('character-carousel')).toBeInTheDocument();
    });

    it('handles character selection', () => {
      render(<GenerateStory />);
      
      const characterButton = screen.getByText('Test Character');
      fireEvent.click(characterButton);
      
      expect(characterButton).toHaveClass('selected');
    });
  });

  describe('Generate Button State', () => {
    it('enables generate button when all selections are made', () => {
      render(<GenerateStory />);
      
      // Select character
      fireEvent.click(screen.getByText('Test Character'));
      
      // Select theme
      fireEvent.click(screen.getByText('THEME'));
      fireEvent.click(screen.getByText('Friendship'));
      
      // Select setting
      fireEvent.click(screen.getByText('SETTING'));
      fireEvent.click(screen.getByText('Forest'));
      
      const generateButton = screen.getByText('GENERATE A STORY');
      expect(generateButton).not.toBeDisabled();
    });

    it('remains disabled if any selection is missing', () => {
      render(<GenerateStory />);
      
      // Only select character and theme, not setting
      fireEvent.click(screen.getByText('Test Character'));
      fireEvent.click(screen.getByText('THEME'));
      fireEvent.click(screen.getByText('Friendship'));
      
      const generateButton = screen.getByText('GENERATE A STORY');
      expect(generateButton).toBeDisabled();
    });
  });

  describe('Story Generation', () => {
    it('calls generateStory with correct parameters when button is clicked', async () => {
      render(<GenerateStory />);
      
      // Make all selections
      fireEvent.click(screen.getByText('Test Character'));
      fireEvent.click(screen.getByText('THEME'));
      fireEvent.click(screen.getByText('Friendship'));
      fireEvent.click(screen.getByText('SETTING'));
      fireEvent.click(screen.getByText('Forest'));
      
      // Click generate button
      fireEvent.click(screen.getByText('GENERATE A STORY'));
      
      await waitFor(() => {
        expect(mockGenerateStory).toHaveBeenCalledWith({
          selectedCharacter: 'TestCharacter',
          selectedTheme: 'Friendship',
          selectedSetting: 'Forest'
        });
      });
    });

    it('shows loading screen when story generation starts', async () => {
      mockUseGenerateStory.isLoadingStory = true;
      
      render(<GenerateStory />);
      
      // Make all selections
      fireEvent.click(screen.getByText('Test Character'));
      fireEvent.click(screen.getByText('THEME'));
      fireEvent.click(screen.getByText('Friendship'));
      fireEvent.click(screen.getByText('SETTING'));
      fireEvent.click(screen.getByText('Forest'));
      
      // Click generate button
      fireEvent.click(screen.getByText('GENERATE A STORY'));
      
      expect(screen.getByTestId('story-loading-screen')).toBeInTheDocument();
    });

    it('shows story rendering view when story is generated', () => {
      mockUseStoryContext.generatedStory = { title: 'Test Story' };
      
      render(<GenerateStory />);
      
      // Make all selections and generate
      fireEvent.click(screen.getByText('Test Character'));
      fireEvent.click(screen.getByText('THEME'));
      fireEvent.click(screen.getByText('Friendship'));
      fireEvent.click(screen.getByText('SETTING'));
      fireEvent.click(screen.getByText('Forest'));
      fireEvent.click(screen.getByText('GENERATE A STORY'));
      
      expect(screen.getByTestId('story-rendering-view')).toBeInTheDocument();
      expect(screen.getByText('Story: Test Story')).toBeInTheDocument();
    });

    it('handles back to settings from story view', () => {
      mockUseStoryContext.generatedStory = { title: 'Test Story' };
      
      render(<GenerateStory />);
      
      // Make all selections and generate
      fireEvent.click(screen.getByText('Test Character'));
      fireEvent.click(screen.getByText('THEME'));
      fireEvent.click(screen.getByText('Friendship'));
      fireEvent.click(screen.getByText('SETTING'));
      fireEvent.click(screen.getByText('Forest'));
      fireEvent.click(screen.getByText('GENERATE A STORY'));
      
      // Click back button
      fireEvent.click(screen.getByText('Back to Settings'));
      
      // Should show the settings view again
      expect(screen.getByText('Choose your story\'s:')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('passes loading states to StoryLoadingScreen', () => {
      Object.assign(mockUseGenerateStory, {
        isLoadingStory: true,
        isStoryComplete: false,
        isLoadingImage: true,
        isImageComplete: false,
        isLoadingAudio: false,
        isAudioComplete: true,
      });
      
      render(<GenerateStory />);
      
      // Trigger story generation
      fireEvent.click(screen.getByText('Test Character'));
      fireEvent.click(screen.getByText('THEME'));
      fireEvent.click(screen.getByText('Friendship'));
      fireEvent.click(screen.getByText('SETTING'));
      fireEvent.click(screen.getByText('Forest'));
      fireEvent.click(screen.getByText('GENERATE A STORY'));
      
      expect(screen.getByText('Loading Story: true')).toBeInTheDocument();
      expect(screen.getByText('Story Complete: false')).toBeInTheDocument();
      expect(screen.getByText('Loading Image: true')).toBeInTheDocument();
      expect(screen.getByText('Image Complete: false')).toBeInTheDocument();
      expect(screen.getByText('Loading Audio: false')).toBeInTheDocument();
      expect(screen.getByText('Audio Complete: true')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('logs error when story generation fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockUseGenerateStory.errorStory = 'Test error';
      
      render(<GenerateStory />);
      
      // Make all selections and generate
      fireEvent.click(screen.getByText('Test Character'));
      fireEvent.click(screen.getByText('THEME'));
      fireEvent.click(screen.getByText('Friendship'));
      fireEvent.click(screen.getByText('SETTING'));
      fireEvent.click(screen.getByText('Forest'));
      
      fireEvent.click(screen.getByText('GENERATE A STORY'));
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error generating story:', 'Test error');
      });
      
      consoleSpy.mockRestore();
    });
  });
});