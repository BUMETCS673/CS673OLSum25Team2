// Settings.test.jsx
import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Settings from '../src/pages/Settings/Settings';
import { useGenSampleAudio } from '../src/hooks/Settings/useGenSampleAudio';
import { useGetSettingEnums } from '../src/hooks/Settings/useGetSettingEnums';
import { useGetSetting } from '../src/hooks/Settings/useGetSetting';
import { useUpdateSetting } from '../src/hooks/Settings/useUpdateSetting';
import { toast } from 'react-toastify';

vi.mock('../src/hooks/Settings/useGenSampleAudio');
vi.mock('../src/hooks/Settings/useGetSettingEnums');
vi.mock('../src/hooks/Settings/useGetSetting');
vi.mock('../src/hooks/Settings/useUpdateSetting');

vi.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

global.Audio = vi.fn().mockImplementation((url) => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  onended: null,
  onerror: null,
}));

const mockEnums = {
  ttsConfig: {
    voices: ['Voice 1', 'Voice 2', 'Voice 3'],
    models: ['tts-1', 'tts-2', 'tts-3'],
  },
  storyConfig: {
    allowedThemes: ['Adventure', 'Fantasy', 'Mystery', 'Friendship', 'Learning'],
    blockedTopics: ['Violence', 'Scary Content', 'Adult Themes'],
  },
};

const mockSettings = {
  response: {
    ttsConfig: {
      voice: 'Voice 1',
      model: 'tts-1',
    },
    imageConfig: {
      model: 'dall-e-2',
    },
    storyConfig: {
      wordCount: 300,
      allowedThemes: ['Adventure', 'Fantasy'],
      blockedTopics: ['Violence'],
    },
  },
};

describe('Settings Component', () => {
  let mockGenerateSampleAudio;
  let mockUpdateSetting;

  beforeEach(() => {
    mockGenerateSampleAudio = vi.fn();
    mockUpdateSetting = vi.fn();

    useGenSampleAudio.mockReturnValue({
      GenerateSampleAudio: mockGenerateSampleAudio,
      isPreviewLoading: false,
      PreviewError: null,
    });

    useGetSettingEnums.mockReturnValue({
      enums: mockEnums,
      isEnumsLoading: false,
    });

    useGetSetting.mockReturnValue({
      setting: mockSettings,
      isGetSettingLoading: false,
    });

    useUpdateSetting.mockReturnValue({
      updateSetting: mockUpdateSetting,
      isUpdateSettingLoading: false,
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderSettings = () => {
    return render(<Settings />);
  };

  describe('Text-to-Speech Configuration', () => {
    it('should load and display current TTS settings', () => {
        renderSettings();

        const voiceSelect = document.querySelector('.voice-select');
        expect(voiceSelect).toHaveValue('Voice 1');

        const tts1Button = screen.getByRole('button', { name: 'tts-1' });
        expect(tts1Button).toHaveClass('active');
    });

    it('should allow voice selection change', async () => {
        renderSettings();
        const user = userEvent.setup();

        const voiceSelect = document.querySelector('.voice-select');
        await user.selectOptions(voiceSelect, 'Voice 2');

        expect(voiceSelect).toHaveValue('Voice 2');
    });

    it('should allow TTS model selection', async () => {
      renderSettings();
      const user = userEvent.setup();

      const tts2Button = screen.getByRole('button', { name: 'tts-2' });
      await user.click(tts2Button);

      expect(tts2Button).toHaveClass('active');
      expect(screen.getByRole('button', { name: 'tts-1' })).not.toHaveClass('active');
    });

    it('should disable preview button when voice or model not selected', async () => {
        renderSettings();
        const user = userEvent.setup();

        // Clear voice selection
        const voiceSelect = document.querySelector('.voice-select');
        await user.selectOptions(voiceSelect, '');

        const previewButton = screen.getByRole('button', { name: 'Preview Voice' });
        expect(previewButton).toBeDisabled();
    });

    it('should handle voice preview', async () => {
      mockGenerateSampleAudio.mockResolvedValue({
        audioUrl: 'https://example.com/audio.mp3',
      });

      renderSettings();
      const user = userEvent.setup();

      const previewButton = screen.getByRole('button', { name: 'Preview Voice' });
      await user.click(previewButton);

      expect(mockGenerateSampleAudio).toHaveBeenCalledWith('Voice 1', 'tts-1');
      expect(global.Audio).toHaveBeenCalledWith('https://example.com/audio.mp3');
    });

    it('should show error toast when TTS preview fails', async () => {
      mockGenerateSampleAudio.mockResolvedValue(null);

      renderSettings();
      const user = userEvent.setup();

      const previewButton = screen.getByRole('button', { name: 'Preview Voice' });
      await user.click(previewButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "TTS (Text-to-Speech) model doesn't support the selected voice",
          expect.any(Object)
        );
      });
    });

    it('should save TTS settings', async () => {
      renderSettings();
      const user = userEvent.setup();

      // Change settings
      const voiceSelect = document.querySelector('.voice-select');
      await user.selectOptions(voiceSelect, 'Voice 2');
      await user.click(screen.getByRole('button', { name: 'tts-2' }));

      // Save - find the save button in the TTS section
      const ttsSection = document.querySelector('.tts-section');
      const saveButton = within(ttsSection).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(mockUpdateSetting).toHaveBeenCalledWith({
        ttsConfig: {
          voice: 'Voice 2',
          model: 'tts-2',
        },
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Settings saved! Your new voice configuration is now active.",
          expect.any(Object)
        );
      });
    });
  });

  describe('Image Generation Controls', () => {
    it('should load and display current image model', () => {
      renderSettings();

      const dalleButton = screen.getByRole('button', { name: /dall-e-2/i });
      expect(dalleButton).toHaveClass('active');
    });

    it('should allow image model selection', async () => {
      renderSettings();
      const user = userEvent.setup();

      const dalle3Button = screen.getByRole('button', { name: /dall-e-3/i });
      await user.click(dalle3Button);

      expect(dalle3Button).toHaveClass('active');
      expect(screen.getByRole('button', { name: /dall-e-2/i })).not.toHaveClass('active');
    });

    it('should save image settings', async () => {
      renderSettings();
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /dall-e-3/i }));

      const saveButtons = screen.getAllByRole('button', { name: 'Save' });
      await user.click(saveButtons[1]); // Second save button is for images

      expect(mockUpdateSetting).toHaveBeenCalledWith({
        imageConfig: {
          model: 'dall-e-3',
        },
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Settings saved! Your new image model settings is now active.",
          expect.any(Object)
        );
      });
    });
  });

  describe('Story Generation Parameters', () => {
    it('should load and display current story settings', () => {
      renderSettings();

      // Check word count
      expect(screen.getByText('Word Count: 300 words')).toBeInTheDocument();

      // Check selected themes
      const adventureCheckbox = screen.getByLabelText('Adventure');
      const fantasyCheckbox = screen.getByLabelText('Fantasy');
      expect(adventureCheckbox).toBeChecked();
      expect(fantasyCheckbox).toBeChecked();

      // Check blocked topics
      const violenceCheckbox = screen.getByLabelText('Violence');
      expect(violenceCheckbox).toBeChecked();
    });

    it('should update word count with slider', async () => {
      renderSettings();
      const user = userEvent.setup();

      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '400' } });

      expect(screen.getByText('Word Count: 400 words')).toBeInTheDocument();
    });

    it('should toggle theme selection', async () => {
      renderSettings();
      const user = userEvent.setup();

      const mysteryCheckbox = screen.getByLabelText('Mystery');
      expect(mysteryCheckbox).not.toBeChecked();

      await user.click(mysteryCheckbox);
      expect(mysteryCheckbox).toBeChecked();

      await user.click(mysteryCheckbox);
      expect(mysteryCheckbox).not.toBeChecked();
    });

    it('should select all themes', async () => {
      renderSettings();
      const user = userEvent.setup();

      const selectAllButton = screen.getAllByRole('button', { name: 'Select All' })[0];
      await user.click(selectAllButton);

      mockEnums.storyConfig.allowedThemes.forEach(theme => {
        expect(screen.getByLabelText(theme)).toBeChecked();
      });
    });

    it('should deselect all themes', async () => {
      renderSettings();
      const user = userEvent.setup();

      const deselectAllButton = screen.getAllByRole('button', { name: 'Deselect All' })[0];
      await user.click(deselectAllButton);

      mockEnums.storyConfig.allowedThemes.forEach(theme => {
        expect(screen.getByLabelText(theme)).not.toBeChecked();
      });
    });

    it('should toggle blocked topic selection', async () => {
      renderSettings();
      const user = userEvent.setup();

      const scaryCheckbox = screen.getByLabelText('Scary Content');
      expect(scaryCheckbox).not.toBeChecked();

      await user.click(scaryCheckbox);
      expect(scaryCheckbox).toBeChecked();
    });

    it('should save story settings', async () => {
      renderSettings();
      const user = userEvent.setup();

      // Change settings
      fireEvent.change(screen.getByRole('slider'), { target: { value: '350' } });
      await user.click(screen.getByLabelText('Mystery'));
      await user.click(screen.getByLabelText('Scary Content'));

      const saveButtons = screen.getAllByRole('button', { name: 'Save' });
      await user.click(saveButtons[2]); // Third save button is for story

      expect(mockUpdateSetting).toHaveBeenCalledWith({
        storyConfig: {
          wordCount: 350,
          allowedThemes: ['Adventure', 'Fantasy', 'Mystery'],
          blockedTopics: ['Violence', 'Scary Content'],
        },
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Settings saved! Your new story settings is now active.",
          expect.any(Object)
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle audio preview error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockGenerateSampleAudio.mockRejectedValue(new Error('Network error'));

      renderSettings();
      const user = userEvent.setup();

      const previewButton = screen.getByRole('button', { name: 'Preview Voice' });
      await user.click(previewButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Preview error:', expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });

    it('should handle save errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockUpdateSetting.mockRejectedValue(new Error('Save failed'));

      renderSettings();
      const user = userEvent.setup();

      const saveButtons = screen.getAllByRole('button', { name: 'Save' });
      await user.click(saveButtons[0]);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Save error:', expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Audio Playback Management', () => {
    it('should stop current audio when starting new preview', async () => {
      const mockAudioInstance = {
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        onended: null,
        onerror: null,
      };
      
      global.Audio = vi.fn().mockReturnValue(mockAudioInstance);
      
      mockGenerateSampleAudio.mockResolvedValue({
        audioUrl: 'https://example.com/audio.mp3',
      });

      renderSettings();
      const user = userEvent.setup();

      const previewButton = screen.getByRole('button', { name: 'Preview Voice' });
      
      // First preview
      await user.click(previewButton);
      expect(mockAudioInstance.play).toHaveBeenCalled();

      // Second preview should pause first
      await user.click(previewButton);
      expect(mockAudioInstance.pause).toHaveBeenCalled();
    });

    it('should handle audio playback completion', async () => {
      const mockAudioInstance = {
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        onended: null,
        onerror: null,
      };
      
      global.Audio = vi.fn().mockReturnValue(mockAudioInstance);
      
      mockGenerateSampleAudio.mockResolvedValue({
        audioUrl: 'https://example.com/audio.mp3',
      });

      renderSettings();
      const user = userEvent.setup();

      const previewButton = screen.getByRole('button', { name: 'Preview Voice' });
      await user.click(previewButton);

      // Simulate audio ending
      mockAudioInstance.onended();

      // Button should be clickable again
      expect(previewButton).not.toBeDisabled();
    });
  });

  describe('Button States', () => {
    it('should show loading state on preview button during audio generation', async () => {
      useGenSampleAudio.mockReturnValue({
        GenerateSampleAudio: mockGenerateSampleAudio,
        isPreviewLoading: true,
        PreviewError: null,
      });

      renderSettings();

      const previewButton = screen.getByRole('button', { name: 'Loading...' });
      expect(previewButton).toBeDisabled();
    });

    it('should show loading state on save button during save operation', async () => {
      renderSettings();
      const user = userEvent.setup();

      // Mock slow save operation
      mockUpdateSetting.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      const saveButtons = screen.getAllByRole('button', { name: 'Save' });
      await user.click(saveButtons[0]);

      // Should show saving state
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    it('should disable save button for images when no model selected', async () => {
      useGetSetting.mockReturnValue({
        setting: {
          response: {
            ...mockSettings.response,
            imageConfig: { model: '' },
          },
        },
        isGetSettingLoading: false,
      });

      renderSettings();

      const saveButtons = screen.getAllByRole('button', { name: 'Save' });
      expect(saveButtons[1]).toBeDisabled(); // Image save button
    });
  });

  describe('Complex Interactions', () => {
    it('should maintain selections across multiple changes', async () => {
      renderSettings();
      const user = userEvent.setup();

      // Change multiple TTS settings
      const voiceSelect = document.querySelector('.voice-select');
      await user.selectOptions(voiceSelect, 'Voice 3');
      await user.click(screen.getByRole('button', { name: 'tts-3' }));

      // Change image model
      await user.click(screen.getByRole('button', { name: /gpt-image-1/i }));

      // Change story settings
      fireEvent.change(screen.getByRole('slider'), { target: { value: '450' } });
      await user.click(screen.getByRole('checkbox', { name: 'Learning' }));

      // Verify all changes are maintained
      expect(voiceSelect).toHaveValue('Voice 3');
      expect(screen.getByRole('button', { name: 'tts-3' })).toHaveClass('active');
      expect(screen.getByRole('button', { name: /gpt-image-1/i })).toHaveClass('active');
      expect(screen.getByText('Word Count: 450 words')).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'Learning' })).toBeChecked();
    });

    it('should preserve user selections when save fails', async () => {
      mockUpdateSetting.mockRejectedValue(new Error('Network error'));

      renderSettings();
      const user = userEvent.setup();

      // Make changes
      const voiceSelect = document.querySelector('.voice-select');
      await user.selectOptions(voiceSelect, 'Voice 2');

      // Try to save (will fail)
      const ttsSection = document.querySelector('.tts-section');
      const saveButton = within(ttsSection).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Selection should still be Voice 2
      expect(voiceSelect).toHaveValue('Voice 2');
    });
  });

  describe('Component Integration', () => {
    it('should render toast container', () => {
      renderSettings();
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('should handle complete user flow for TTS configuration', async () => {
      mockGenerateSampleAudio.mockResolvedValue({
      audioUrl: 'https://example.com/audio.mp3',
      });

      renderSettings();
      const user = userEvent.setup();

      // Select new voice and model
      const voiceSelect = document.querySelector('.voice-select');
      await user.selectOptions(voiceSelect, 'Voice 2');
      await user.click(screen.getByRole('button', { name: 'tts-2' }));

      // Preview the voice
      const previewButton = screen.getByRole('button', { name: 'Preview Voice' });
      await user.click(previewButton);
      expect(mockGenerateSampleAudio).toHaveBeenCalledWith('Voice 2', 'tts-2');

      // Save the settings
      const ttsSection = document.querySelector('.tts-section');
      const saveButton = within(ttsSection).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(mockUpdateSetting).toHaveBeenCalledWith({
        ttsConfig: {
          voice: 'Voice 2',
          model: 'tts-2',
        },
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

    it('should handle word count boundaries', async () => {
      renderSettings();

      const slider = screen.getByRole('slider');
      
      // Test minimum
      fireEvent.change(slider, { target: { value: '150' } });
      expect(screen.getByText('Word Count: 150 words')).toBeInTheDocument();

      // Test maximum
      fireEvent.change(slider, { target: { value: '500' } });
      expect(screen.getByText('Word Count: 500 words')).toBeInTheDocument();

      // Test step
      fireEvent.change(slider, { target: { value: '155' } });
      // Should round to nearest step (10)
      expect(slider.value).toBe('155');
    });
  });
});
