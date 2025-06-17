// GenerateStory.test.jsx
import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GenerateStory from '../src/pages/GenerateStory/GenerateStory';
import { useGenerateStory } from '../src/hooks/Story/useGenerateStory';
import { useStoryContext } from '../src/hooks/Story/useStoryContext';
import { useGetSetting } from '../src/hooks/Settings/useGetSetting';

vi.mock('../src/hooks/Story/useGenerateStory');
vi.mock('../src/hooks/Story/useStoryContext');
vi.mock('../src/hooks/Settings/useGetSetting');

vi.mock('../src/components/CharacterCarousel/CharacterCarousel', () => ({
  default: ({ onSelect, selected }) => (
    <div data-testid="character-carousel">
      <button onClick={() => onSelect('Luna')}>Luna</button>
      <button onClick={() => onSelect('Max')}>Max</button>
      <button onClick={() => onSelect('Bella')}>Bella</button>
      {selected && <div>Selected: {selected}</div>}
    </div>
  ),
}));

vi.mock('../src/components/StoryRenderingView/StoryRenderingView', () => ({
  default: ({ onBackToSettings, generateStory }) => (
    <div data-testid="story-rendering-view">
      <h2>Story Generated</h2>
      <p>{generateStory?.title}</p>
      <button onClick={onBackToSettings}>Back to Settings</button>
    </div>
  ),
}));

vi.mock('../src/components/StoryLoadingScreen/StoryLoadingScreen', () => ({
  default: ({ isLoadingStory, isStoryComplete, isLoadingImage, isImageComplete, isLoadingAudio, isAudioComplete }) => (
    <div data-testid="story-loading-screen">
      <p>Loading Story...</p>
      {isLoadingStory && <span>Story loading</span>}
      {isStoryComplete && <span>Story complete</span>}
      {isLoadingImage && <span>Image loading</span>}
      {isImageComplete && <span>Image complete</span>}
      {isLoadingAudio && <span>Audio loading</span>}
      {isAudioComplete && <span>Audio complete</span>}
    </div>
  ),
}));

vi.mock('../src/components/LoadingError/LoadingError', () => ({
  LoadingSpinner: ({ message }) => <div data-testid="loading-spinner">{message}</div>,
}));

const mockSettings = {
  response: {
    storyConfig: {
      allowedThemes: ['Adventure', 'Friendship', 'Mystery', 'Magic', 'Comedy', 'Learning'],
    },
  },
};

describe('GenerateStory Component', () => {
  let mockGenerateStory;
  let mockResetGenerateStory;

  beforeEach(() => {
    mockGenerateStory = vi.fn();
    mockResetGenerateStory = vi.fn();

    useGenerateStory.mockReturnValue({
      resetGenerateStory: mockResetGenerateStory,
      generateStory: mockGenerateStory,
      isLoadingStory: false,
      isStoryComplete: false,
      isLoadingImage: false,
      isImageComplete: false,
      isLoadingAudio: false,
      isAudioComplete: false,
      errorStory: null,
    });

    useStoryContext.mockReturnValue({
      generatedStory: null,
    });

    useGetSetting.mockReturnValue({
      setting: mockSettings,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderGenerateStory = () => {
    return render(<GenerateStory />);
  };

  describe('Component Loading', () => {
    it('should show loading spinner when settings are not loaded', () => {
      useGetSetting.mockReturnValue({ setting: null });
      
      renderGenerateStory();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading Story Generator')).toBeInTheDocument();
    });

    it('should render main component when settings are loaded', () => {
      renderGenerateStory();
      
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(document.querySelector('.story-container')).toBeInTheDocument();
    });
  });

  describe('Initial State', () => {
    it('should render with character menu active by default', () => {
      renderGenerateStory();
      
      const characterButton = screen.getByRole('button', { name: 'CHARACTER' });
      expect(characterButton).toHaveClass('active');
      expect(screen.getByTestId('character-carousel')).toBeInTheDocument();
    });

    it('should render all menu buttons', () => {
      renderGenerateStory();
      
      expect(screen.getByRole('button', { name: 'CHARACTER' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'THEME' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'SETTING' })).toBeInTheDocument();
    });

    it('should show instruction text', () => {
      renderGenerateStory();
      
      expect(screen.getByText("Choose your story's:")).toBeInTheDocument();
    });

    it('should have generate button disabled initially', () => {
      renderGenerateStory();
      
      const generateButton = screen.getByRole('button', { name: 'GENERATE A STORY' });
      expect(generateButton).toBeDisabled();
    });
  });

  describe('Menu Navigation', () => {
    it('should switch to theme menu when THEME button clicked', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      const themeButton = screen.getByRole('button', { name: 'THEME' });
      await user.click(themeButton);
      
      expect(themeButton).toHaveClass('active');
      expect(screen.getByRole('button', { name: 'CHARACTER' })).not.toHaveClass('active');
      
      // Should show theme options
      mockSettings.response.storyConfig.allowedThemes.forEach(theme => {
        expect(screen.getByRole('button', { name: theme })).toBeInTheDocument();
      });
    });

    it('should switch to setting menu when SETTING button clicked', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      const settingButton = screen.getByRole('button', { name: 'SETTING' });
      await user.click(settingButton);
      
      expect(settingButton).toHaveClass('active');
      
      // Should show setting options
      const settingOptions = ['Forest', 'Castle', 'Underwater', 'Space', 'Playground'];
      settingOptions.forEach(setting => {
        expect(screen.getByRole('button', { name: setting })).toBeInTheDocument();
      });
    });

    it('should switch back to character menu', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      // First switch to theme
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      
      // Then back to character
      await user.click(screen.getByRole('button', { name: 'CHARACTER' }));
      
      expect(screen.getByRole('button', { name: 'CHARACTER' })).toHaveClass('active');
      expect(screen.getByTestId('character-carousel')).toBeInTheDocument();
    });
  });

  describe('Character Selection', () => {
    it('should select a character from carousel', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      const lunaButton = within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' });
      await user.click(lunaButton);
      
      expect(screen.getByText('Selected: Luna')).toBeInTheDocument();
    });

    it('should update selected character when different character clicked', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      const carousel = screen.getByTestId('character-carousel');
      
      await user.click(within(carousel).getByRole('button', { name: 'Luna' }));
      expect(screen.getByText('Selected: Luna')).toBeInTheDocument();
      
      await user.click(within(carousel).getByRole('button', { name: 'Max' }));
      expect(screen.getByText('Selected: Max')).toBeInTheDocument();
    });
  });

  describe('Theme Selection', () => {
    it('should select a theme', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      
      const adventureButton = screen.getByRole('button', { name: 'Adventure' });
      await user.click(adventureButton);
      
      expect(adventureButton).toHaveClass('selected');
    });

    it('should only allow one theme to be selected', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      
      const adventureButton = screen.getByRole('button', { name: 'Adventure' });
      const friendshipButton = screen.getByRole('button', { name: 'Friendship' });
      
      await user.click(adventureButton);
      await user.click(friendshipButton);
      
      expect(adventureButton).not.toHaveClass('selected');
      expect(friendshipButton).toHaveClass('selected');
    });
  });

  describe('Setting Selection', () => {
    it('should select a setting', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      
      const forestButton = screen.getByRole('button', { name: 'Forest' });
      await user.click(forestButton);
      
      expect(forestButton).toHaveClass('selected');
    });

    it('should render all setting options', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      
      const expectedSettings = [
        'Forest', 'Castle', 'Underwater', 'Space', 'Playground',
        'Farm', 'City', 'Mountain', 'Pirate Ship', 'Home',
        'Jungle', 'Beach', 'Zoo', 'Tree house', 'Library'
      ];
      
      expectedSettings.forEach(setting => {
        expect(screen.getByRole('button', { name: setting })).toBeInTheDocument();
      });
    });
  });

  describe('Generate Story Button', () => {
    it('should enable generate button when all selections made', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      const generateButton = screen.getByRole('button', { name: 'GENERATE A STORY' });
      expect(generateButton).toBeDisabled();
      
      // Select character
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      expect(generateButton).toBeDisabled();
      
      // Select theme
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      expect(generateButton).toBeDisabled();
      
      // Select setting
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      
      expect(generateButton).toBeEnabled();
    });

    it('should keep selections when switching between menus', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Make all selections
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      
      // Switch back to previous menus and verify selections persist
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      expect(screen.getByRole('button', { name: 'Adventure' })).toHaveClass('selected');
      
      await user.click(screen.getByRole('button', { name: 'CHARACTER' }));
      expect(screen.getByText('Selected: Luna')).toBeInTheDocument();
    });
  });

  describe('Story Generation', () => {
    it('should show loading screen when generating story', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Make selections
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      
      // Click generate
      await user.click(screen.getByRole('button', { name: 'GENERATE A STORY' }));
      
      expect(screen.getByTestId('story-loading-screen')).toBeInTheDocument();
      expect(mockResetGenerateStory).toHaveBeenCalled();
      expect(mockGenerateStory).toHaveBeenCalledWith({
        selectedCharacter: 'Luna',
        selectedTheme: 'Adventure',
        selectedSetting: 'Forest',
      });
    });

    it('should show story rendering view when story is generated', async () => {
      useStoryContext.mockReturnValue({
        generatedStory: { title: 'Luna\'s Adventure in the Forest' },
      });
      
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Make selections
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      
      // Click generate
      await user.click(screen.getByRole('button', { name: 'GENERATE A STORY' }));
      
      expect(screen.getByTestId('story-rendering-view')).toBeInTheDocument();
      expect(screen.getByText("Luna's Adventure in the Forest")).toBeInTheDocument();
    });

    it('should return to settings when back button clicked', async () => {
      useStoryContext.mockReturnValue({
        generatedStory: { title: 'Test Story' },
      });
      
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Make selections and generate
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      await user.click(screen.getByRole('button', { name: 'GENERATE A STORY' }));
      
      // Click back to settings
      await user.click(screen.getByRole('button', { name: 'Back to Settings' }));
      
      // Should show selection interface again
      expect(screen.queryByTestId('story-rendering-view')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'CHARACTER' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'GENERATE A STORY' })).toBeInTheDocument();
    });

    it('should handle story generation error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      useGenerateStory.mockReturnValue({
        resetGenerateStory: mockResetGenerateStory,
        generateStory: mockGenerateStory,
        isLoadingStory: false,
        isStoryComplete: false,
        isLoadingImage: false,
        isImageComplete: false,
        isLoadingAudio: false,
        isAudioComplete: false,
        errorStory: 'Failed to generate story',
      });
      
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Make selections
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      
      // Click generate
      await user.click(screen.getByRole('button', { name: 'GENERATE A STORY' }));
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating story:', 'Failed to generate story');
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Loading States', () => {
    it('should show story loading progress', async () => {
      useGenerateStory.mockReturnValue({
        resetGenerateStory: mockResetGenerateStory,
        generateStory: mockGenerateStory,
        isLoadingStory: true,
        isStoryComplete: false,
        isLoadingImage: false,
        isImageComplete: false,
        isLoadingAudio: false,
        isAudioComplete: false,
        errorStory: null,
      });
      
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Make selections and generate
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      await user.click(screen.getByRole('button', { name: 'GENERATE A STORY' }));
      
      expect(screen.getByText('Story loading')).toBeInTheDocument();
    });

    it('should show all loading states', async () => {
      useGenerateStory.mockReturnValue({
        resetGenerateStory: mockResetGenerateStory,
        generateStory: mockGenerateStory,
        isLoadingStory: true,
        isStoryComplete: true,
        isLoadingImage: true,
        isImageComplete: true,
        isLoadingAudio: true,
        isAudioComplete: true,
        errorStory: null,
      });
      
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Make selections and generate
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      await user.click(screen.getByRole('button', { name: 'GENERATE A STORY' }));
      
      const loadingScreen = screen.getByTestId('story-loading-screen');
      expect(within(loadingScreen).getByText('Story loading')).toBeInTheDocument();
      expect(within(loadingScreen).getByText('Story complete')).toBeInTheDocument();
      expect(within(loadingScreen).getByText('Image loading')).toBeInTheDocument();
      expect(within(loadingScreen).getByText('Image complete')).toBeInTheDocument();
      expect(within(loadingScreen).getByText('Audio loading')).toBeInTheDocument();
      expect(within(loadingScreen).getByText('Audio complete')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should have correct container structure', () => {
      renderGenerateStory();
      
      expect(document.querySelector('.story-container')).toBeInTheDocument();
      expect(document.querySelector('.story-panel')).toBeInTheDocument();
      expect(document.querySelector('.panel-content')).toBeInTheDocument();
      expect(document.querySelector('.left-menu')).toBeInTheDocument();
      expect(document.querySelector('.right-panel')).toBeInTheDocument();
    });

    it('should have correct button structure', () => {
      renderGenerateStory();
      
      const leftButtons = document.querySelector('.left-buttons');
      expect(leftButtons).toBeInTheDocument();
      expect(within(leftButtons).getByRole('button', { name: 'CHARACTER' })).toBeInTheDocument();
      expect(within(leftButtons).getByRole('button', { name: 'THEME' })).toBeInTheDocument();
      expect(within(leftButtons).getByRole('button', { name: 'SETTING' })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty theme list', () => {
      useGetSetting.mockReturnValue({
        setting: {
          response: {
            storyConfig: {
              allowedThemes: [],
            },
          },
        },
      });
      
      renderGenerateStory();
      const user = userEvent.setup();
      
      fireEvent.click(screen.getByRole('button', { name: 'THEME' }));
      
      // Should show empty theme panel
      const optionGrid = document.querySelector('.option-grid');
      expect(optionGrid).toBeInTheDocument();
      expect(optionGrid.children).toHaveLength(0);
    });

    it('should maintain state through re-renders', async () => {
      const { rerender } = renderGenerateStory();
      const user = userEvent.setup();
      
      // Make selections
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      
      // Force re-render
      rerender(<GenerateStory />);
      
      // Check that selections are maintained
      expect(screen.getByRole('button', { name: 'Adventure' })).toHaveClass('selected');
    });

    it('should handle rapid menu switching', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Rapidly switch between menus
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'CHARACTER' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      
      // Should end up on theme menu
      expect(screen.getByRole('button', { name: 'THEME' })).toHaveClass('active');
      expect(screen.getByRole('button', { name: 'Adventure' })).toBeInTheDocument();
    });
  });

  describe('Console Logging', () => {
    it('should log selected options when generating story', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Make selections
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Max' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Mystery' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Castle' }));
      
      // Generate story
      await user.click(screen.getByRole('button', { name: 'GENERATE A STORY' }));
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Max', 'Mystery', 'Castle');
      
      consoleLogSpy.mockRestore();
    });
  });

  describe('Integration Tests', () => {
    it('should complete full story generation flow', async () => {
      // Start with loading states
      const { rerender } = renderGenerateStory();
      const user = userEvent.setup();
      
      // Make all selections
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Bella' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Magic' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Underwater' }));
      
      // Generate story
      await user.click(screen.getByRole('button', { name: 'GENERATE A STORY' }));
      
      // Verify loading screen appears
      expect(screen.getByTestId('story-loading-screen')).toBeInTheDocument();
      
      // Simulate story generation completion
      useStoryContext.mockReturnValue({
        generatedStory: { 
          title: 'Bella\'s Magical Underwater Adventure',
          content: 'Once upon a time...',
        },
      });
      
      rerender(<GenerateStory />);
      
      // Verify story is displayed
      expect(screen.getByTestId('story-rendering-view')).toBeInTheDocument();
      expect(screen.getByText('Bella\'s Magical Underwater Adventure')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      renderGenerateStory();
      
      expect(screen.getByRole('button', { name: 'CHARACTER' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'THEME' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'SETTING' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'GENERATE A STORY' })).toBeInTheDocument();
    });

    it('should indicate button states clearly', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      const generateButton = screen.getByRole('button', { name: 'GENERATE A STORY' });
      
      // Initially disabled
      expect(generateButton).toHaveAttribute('disabled');
      
      // Make all selections
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      
      // Now enabled
      expect(generateButton).not.toHaveAttribute('disabled');
    });

    it('should provide clear visual feedback for active menu', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      const characterBtn = screen.getByRole('button', { name: 'CHARACTER' });
      const themeBtn = screen.getByRole('button', { name: 'THEME' });
      const settingBtn = screen.getByRole('button', { name: 'SETTING' });
      
      // Character is active by default
      expect(characterBtn).toHaveClass('active');
      expect(themeBtn).not.toHaveClass('active');
      expect(settingBtn).not.toHaveClass('active');
      
      // Switch to theme
      await user.click(themeBtn);
      expect(characterBtn).not.toHaveClass('active');
      expect(themeBtn).toHaveClass('active');
      expect(settingBtn).not.toHaveClass('active');
    });

    it('should provide clear visual feedback for selected options', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Switch to theme menu
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      
      const adventureBtn = screen.getByRole('button', { name: 'Adventure' });
      const friendshipBtn = screen.getByRole('button', { name: 'Friendship' });
      
      // Initially no selection
      expect(adventureBtn).not.toHaveClass('selected');
      expect(friendshipBtn).not.toHaveClass('selected');
      
      // Select adventure
      await user.click(adventureBtn);
      expect(adventureBtn).toHaveClass('selected');
      expect(friendshipBtn).not.toHaveClass('selected');
    });
  });

  describe('Performance and Optimization', () => {
    it('should only call generateStory once per click', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Make selections
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      
      // Click generate multiple times quickly
      const generateButton = screen.getByRole('button', { name: 'GENERATE A STORY' });
      await user.click(generateButton);
      await user.click(generateButton);
      await user.click(generateButton);
      
      // Should only be called once
      expect(mockGenerateStory).toHaveBeenCalledTimes(1);
    });

    it('should reset properly before generating new story', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Make selections and generate
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      await user.click(screen.getByRole('button', { name: 'GENERATE A STORY' }));
      
      expect(mockResetGenerateStory).toHaveBeenCalledTimes(1);
      expect(mockResetGenerateStory).toHaveBeenCalledBefore(mockGenerateStory);
    });
  });

  describe('Theme Configuration', () => {
    it('should display themes from settings configuration', () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      fireEvent.click(screen.getByRole('button', { name: 'THEME' }));
      
      // Verify all configured themes are displayed
      mockSettings.response.storyConfig.allowedThemes.forEach(theme => {
        expect(screen.getByRole('button', { name: theme })).toBeInTheDocument();
      });
    });

    it('should handle dynamic theme updates', () => {
      const { rerender } = renderGenerateStory();
      
      fireEvent.click(screen.getByRole('button', { name: 'THEME' }));
      
      // Verify initial themes
      expect(screen.getByRole('button', { name: 'Adventure' })).toBeInTheDocument();
      
      // Update settings with new themes
      const newSettings = {
        response: {
          storyConfig: {
            allowedThemes: ['Fantasy', 'Science Fiction', 'Mystery'],
          },
        },
      };
      
      useGetSetting.mockReturnValue({ setting: newSettings });
      rerender(<GenerateStory />);
      
      // Should show new themes
      fireEvent.click(screen.getByRole('button', { name: 'THEME' }));
      expect(screen.queryByRole('button', { name: 'Adventure' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Fantasy' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Science Fiction' })).toBeInTheDocument();
    });
  });

  describe('State Persistence', () => {
    it('should maintain character selection across menu changes', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Select character
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Max' }));
      expect(screen.getByText('Selected: Max')).toBeInTheDocument();
      
      // Navigate through all menus
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'CHARACTER' }));
      
      // Character selection should persist
      expect(screen.getByText('Selected: Max')).toBeInTheDocument();
    });

    it('should maintain all selections until story generation', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Make all selections
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Bella' }));
      
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Magic' }));
      
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Castle' }));
      
      // Verify all selections before generation
      await user.click(screen.getByRole('button', { name: 'CHARACTER' }));
      expect(screen.getByText('Selected: Bella')).toBeInTheDocument();
      
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      expect(screen.getByRole('button', { name: 'Magic' })).toHaveClass('selected');
      
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      expect(screen.getByRole('button', { name: 'Castle' })).toHaveClass('selected');
      
      // Generate story with correct parameters
      await user.click(screen.getByRole('button', { name: 'GENERATE A STORY' }));
      expect(mockGenerateStory).toHaveBeenCalledWith({
        selectedCharacter: 'Bella',
        selectedTheme: 'Magic',
        selectedSetting: 'Castle',
      });
    });
  });

  describe('UI Responsiveness', () => {
    it('should show option grid with correct class', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Check theme grid
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      let optionGrid = document.querySelector('.option-grid');
      expect(optionGrid).toBeInTheDocument();
      expect(optionGrid.children.length).toBe(mockSettings.response.storyConfig.allowedThemes.length);
      
      // Check setting grid
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      optionGrid = document.querySelector('.option-grid');
      expect(optionGrid).toBeInTheDocument();
      expect(optionGrid.children.length).toBe(15); // Number of hardcoded settings
    });

    it('should apply correct classes to option buttons', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      
      const adventureBtn = screen.getByRole('button', { name: 'Adventure' });
      expect(adventureBtn).toHaveClass('option-button');
      expect(adventureBtn).not.toHaveClass('selected');
      
      await user.click(adventureBtn);
      expect(adventureBtn).toHaveClass('option-button');
      expect(adventureBtn).toHaveClass('selected');
    });
  });

  describe('Complex User Flows', () => {
    it('should handle changing selections multiple times', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      // First set of selections
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      
      // Change character
      await user.click(screen.getByRole('button', { name: 'CHARACTER' }));
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Max' }));
      
      // Change theme
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Mystery' }));
      
      // Change setting
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Castle' }));
      
      // Generate with updated selections
      await user.click(screen.getByRole('button', { name: 'GENERATE A STORY' }));
      
      expect(mockGenerateStory).toHaveBeenCalledWith({
        selectedCharacter: 'Max',
        selectedTheme: 'Mystery',
        selectedSetting: 'Castle',
      });
    });

    it('should handle partial selections correctly', async () => {
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Only select character
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      
      let generateButton = screen.getByRole('button', { name: 'GENERATE A STORY' });
      expect(generateButton).toBeDisabled();
      
      // Add theme
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      
      generateButton = screen.getByRole('button', { name: 'GENERATE A STORY' });
      expect(generateButton).toBeDisabled();
      
      // Add setting - now should be enabled
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      
      generateButton = screen.getByRole('button', { name: 'GENERATE A STORY' });
      expect(generateButton).toBeEnabled();
    });
  });

  describe('Memory Leaks and Cleanup', () => {
    it('should clean up when component unmounts', async () => {
      const { unmount } = renderGenerateStory();
      const user = userEvent.setup();
      
      // Make some selections
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      
      // Unmount component
      unmount();
      
      // Verify no errors occur and mocks are not called after unmount
      expect(mockGenerateStory).not.toHaveBeenCalled();
    });

    it('should handle component unmounting during story generation', async () => {
      const { unmount } = renderGenerateStory();
      const user = userEvent.setup();
      
      // Make selections
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      
      // Start generation
      await user.click(screen.getByRole('button', { name: 'GENERATE A STORY' }));
      
      // Immediately unmount
      unmount();
      
      // Should not cause any errors
      expect(mockGenerateStory).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading Screen Details', () => {
    it('should pass all loading states to StoryLoadingScreen', async () => {
      const loadingStates = {
        isLoadingStory: true,
        isStoryComplete: false,
        isLoadingImage: true,
        isImageComplete: false,
        isLoadingAudio: false,
        isAudioComplete: false,
      };
      
      useGenerateStory.mockReturnValue({
        resetGenerateStory: mockResetGenerateStory,
        generateStory: mockGenerateStory,
        ...loadingStates,
        errorStory: null,
      });
      
      renderGenerateStory();
      const user = userEvent.setup();
      
      // Make selections and generate
      await user.click(within(screen.getByTestId('character-carousel')).getByRole('button', { name: 'Luna' }));
      await user.click(screen.getByRole('button', { name: 'THEME' }));
      await user.click(screen.getByRole('button', { name: 'Adventure' }));
      await user.click(screen.getByRole('button', { name: 'SETTING' }));
      await user.click(screen.getByRole('button', { name: 'Forest' }));
      await user.click(screen.getByRole('button', { name: 'GENERATE A STORY' }));
      
      const loadingScreen = screen.getByTestId('story-loading-screen');
      expect(loadingScreen).toBeInTheDocument();
      expect(within(loadingScreen).getByText('Story loading')).toBeInTheDocument();
      expect(within(loadingScreen).getByText('Image loading')).toBeInTheDocument();
      expect(within(loadingScreen).queryByText('Audio loading')).not.toBeInTheDocument();
    });
  });

  describe('Settings Edge Cases', () => {
    it('should handle null settings', () => {
      // When setting is null, the LoadingSpinner is shown
      useGetSetting.mockReturnValue({
        setting: null,
      });
      
      renderGenerateStory();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading Story Generator')).toBeInTheDocument();
    });

    it('should handle undefined settings', () => {
      useGetSetting.mockReturnValue({
        setting: undefined,
      });
      
      renderGenerateStory();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should throw error when accessing undefined allowedThemes in theme menu', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      useGetSetting.mockReturnValue({
        setting: {
          response: {
            storyConfig: {
              // allowedThemes is undefined
            },
          },
        },
      });
      
      renderGenerateStory();
      
      // Component renders initially
      expect(screen.getByRole('button', { name: 'CHARACTER' })).toBeInTheDocument();
      
      // But throws when trying to render theme menu
      const themeButton = screen.getByRole('button', { name: 'THEME' });
      
      expect(() => {
        fireEvent.click(themeButton);
      }).toThrow();
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle empty allowedThemes array', () => {
      useGetSetting.mockReturnValue({
        setting: {
          response: {
            storyConfig: {
              allowedThemes: [],
            },
          },
        },
      });
      
      renderGenerateStory();
      
      // Should render without error
      expect(screen.getByRole('button', { name: 'CHARACTER' })).toBeInTheDocument();
      
      // Click theme button
      fireEvent.click(screen.getByRole('button', { name: 'THEME' }));
      
      // Should show empty theme panel
      const optionGrid = document.querySelector('.option-grid');
      expect(optionGrid).toBeInTheDocument();
      expect(optionGrid.children).toHaveLength(0);
    });

    it('should handle settings with partial data', () => {
      useGetSetting.mockReturnValue({
        setting: {
          response: {
            storyConfig: {
              allowedThemes: ['Adventure'],
              // other expected properties might be missing
            },
          },
        },
      });
      
      renderGenerateStory();
      
      // Should render successfully
      expect(screen.getByRole('button', { name: 'CHARACTER' })).toBeInTheDocument();
      
      // Should be able to access themes
      fireEvent.click(screen.getByRole('button', { name: 'THEME' }));
      expect(screen.getByRole('button', { name: 'Adventure' })).toBeInTheDocument();
    });
  });
});
