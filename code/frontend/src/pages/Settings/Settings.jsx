import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import "./Settings.css";
import Dalle2Img from "../../assets/dalle2.png";
import Dalle3Img from "../../assets/dalle3.png";
import GPTImg1 from "../../assets/gptimg1.png";
import { useGenSampleAudio } from "../../hooks/Settings/useGenSampleAudio";
import { useGetSettingEnums } from "../../hooks/Settings/useGetSettingEnums";
import { useGetSetting } from "../../hooks/Settings/useGetSetting";
import {LoadingSpinner,} from "../../components/LoadingError/LoadingError";
import { useUpdateSetting } from "../../hooks/Settings/useUpdateSetting";

const Settings = () => {
  const imageModels = [
    { name: "dall-e-2", img: Dalle2Img },
    { name: "dall-e-3", img: Dalle3Img },
    { name: "gpt-image-1", img: GPTImg1 },
  ];

  const { GenerateSampleAudio, isPreviewLoading, PreviewError } =
    useGenSampleAudio();
  const { enums, isEnumsLoading } = useGetSettingEnums();
  const { setting, isGetSettingLoading } = useGetSetting();
  const { updateSetting, isUpdateSettingLoading } = useUpdateSetting();

  // Initialize state
  const [selectedVoice, setSelectedVoice] = useState("");
  const [selectedTTSModel, setSelectedTTSModel] = useState("");
  const [selectedImageModel, setSelectedImageModel] = useState("");
  const [wordCount, setWordCount] = useState(300);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [blockedTopics, setBlockedTopics] = useState([]);
  const [isSaveSpeechLoading, setIsSpeechSaveLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  // Update state when setting data is loaded
  useEffect(() => {
    if (setting) {
      // Handle nested structure safely
      if (setting.ttsConfig) {
        setSelectedVoice(setting.ttsConfig.voice || "");
        setSelectedTTSModel(setting.ttsConfig.model || "");
      } else if (setting.response?.ttsConfig) {
        setSelectedVoice(setting.response.ttsConfig.voice || "");
        setSelectedTTSModel(setting.response.ttsConfig.model || "");
      }

      if (setting.imageConfig) {
        setSelectedImageModel(setting.imageConfig.model || "");
      } else if (setting.response?.imageConfig) {
        setSelectedImageModel(setting.response.imageConfig.model || "");
      }

      if (setting.storyConfig) {
        setWordCount(setting.storyConfig.wordCount || 150);
        setSelectedThemes(setting.storyConfig.allowedThemes || []);
        setBlockedTopics(setting.storyConfig.blockedTopics || []);
      } else if (setting.response?.storyConfig) {
        setWordCount(setting.response.storyConfig.wordCount || 150);
        setSelectedThemes(setting.response.storyConfig.allowedThemes || []);
        setBlockedTopics(setting.response.storyConfig.blockedTopics || []);
      }
    }
  }, [setting]);

  const handlePreview = async () => {
    // Stop current audio if playing
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(true);

    try {
      const audioData = await GenerateSampleAudio(
        selectedVoice,
        selectedTTSModel
      );
      const audioUrl = audioData?.audioUrl || audioData?.url;
      console.log("Audio URL:", audioData);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);

        await audio.play();
      } else {
        setIsPlaying(false);
      }

      if (!audioData) {
        toast.error(
          "TTS (Text-to-Speech) model doesn't support the selected voice",
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          }
        );
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Preview error:", error);
      setIsPlaying(false);
    }
  };

  const handleSpeechSave = async () => {
    setIsSpeechSaveLoading(true);

    try {
      // Add your save logic here
      console.log("Saving speech settings...", {
        voice: selectedVoice,
        model: selectedTTSModel,
      });

      const newSetting = {
        ttsConfig: {
          voice: selectedVoice,
          model: selectedTTSModel,
        },
      };
      await updateSetting(newSetting);
      if (!isUpdateSettingLoading) {
        toast.success(
          "Settings saved! Your new voice configuration is now active.",
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          }
        );
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSpeechSaveLoading(false);
    }
  };

  const handleImageSave = async () => {
    console.log({
      imageModel: selectedImageModel,
    });
    const newSetting = {
      imageConfig: {
        model: selectedImageModel,
      },
    };

    await updateSetting(newSetting);
    if (!isUpdateSettingLoading) {
      toast.success(
        "Settings saved! Your new image model settings is now active.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };

  const handleStorySave = async () => {
    console.log({
      wordCount,
      selectedThemes,
      blockedTopics,
    });

    const newSetting = {
      storyConfig: {
        wordCount: wordCount,
        allowedThemes: selectedThemes,
        blockedTopics: blockedTopics,
      },
    };

    await updateSetting(newSetting);
    if (!isUpdateSettingLoading) {
      toast.success("Settings saved! Your new story settings is now active.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const toggleTheme = (theme) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const toggleBlockedTopic = (topic) => {
    setBlockedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const selectAllThemes = () => {
    if (enums?.storyConfig?.allowedThemes) {
      setSelectedThemes([...enums.storyConfig.allowedThemes]);
    }
  };

  const deselectAllThemes = () => setSelectedThemes([]);

  const selectAllBlocked = () => {
    if (enums?.storyConfig?.blockedTopics) {
      setBlockedTopics([...enums.storyConfig.blockedTopics]);
    }
  };

  const deselectAllBlocked = () => setBlockedTopics([]);

  // Show loading state
  if (isEnumsLoading || isGetSettingLoading) {
    return <LoadingSpinner message="Loading Settings" />;
  }

  return (
    <section className="DashboardPage">
      <ToastContainer autoClose={true} />
      {/* Text-to-Speech Configuration */}
      <div className="dashboard-container">
        
        <h3>Text-to-Speech Configuration</h3>

        <div className="tts-section">
          <div className="tts-group">
            <label>Voice Selection:</label>
            <select
              className="voice-select"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              <option value="">Select a voice...</option>
              {enums?.ttsConfig?.voices?.map((voice) => (
                <option key={voice} value={voice}>
                  {voice}
                </option>
              ))}
            </select>
          </div>

          <div className="tts-group">
            <label>Model Selection:</label>
            <div className="tts-button-group">
              {enums?.ttsConfig?.models?.map((model) => (
                <button
                  key={model}
                  className={`model-btn ${
                    selectedTTSModel === model ? "active" : ""
                  }`}
                  onClick={() => setSelectedTTSModel(model)}
                  type="button"
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          <div className="save-button-group">
            <button
              className="preview-btn"
              onClick={handlePreview}
              disabled={!selectedVoice || !selectedTTSModel || isPreviewLoading}
            >
              {isPreviewLoading ? "Loading..." : "Preview Voice"}
            </button>

            <button
              className="save-btn"
              onClick={handleSpeechSave}
              disabled={isSaveSpeechLoading}
            >
              {isSaveSpeechLoading ? <>Saving...</> : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Image Generation Controls */}
      <div className="dashboard-container">
        <h3>Image Generation Controls</h3>
        <div className="tts-section">
          <div className="tts-group">
            <label className="label-img">Image Model Selection:</label>
            <div className="image-button-group">
              {imageModels.map((model) => (
                <button
                  key={model.name}
                  className={`image-btn ${
                    selectedImageModel === model.name ? "active" : ""
                  }`}
                  onClick={() => setSelectedImageModel(model.name)}
                  type="button"
                >
                  <img src={model.img} alt={model.name} />
                </button>
              ))}
            </div>
          </div>

          <button
            className="save-btn save-btn-single"
            onClick={handleImageSave}
            disabled={!selectedImageModel}
          >
            Save
          </button>
        </div>
      </div>

      {/* Story Generation Parameters */}
      <div className="dashboard-container">
        <h3>Story Generation Parameters</h3>

        <div className="tts-section">
          {/* Word Count */}
          <div className="tts-group">
            <label>Word Count: {wordCount} words</label>
            <input
              type="range"
              min="150"
              max="500"
              step="10"
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value))}
            />
          </div>

          {/* Themes */}
          <div className="themes-group">
            <label>Appropriate Themes:</label>
            <div className="checkbox-controls">
              <button className="small-btn" onClick={selectAllThemes}>
                Select All
              </button>
              <button className="small-btn" onClick={deselectAllThemes}>
                Deselect All
              </button>
            </div>
            <div className="checkbox-grid">
              {enums?.storyConfig?.allowedThemes?.map((theme) => (
                <label key={theme}>
                  <input
                    type="checkbox"
                    checked={selectedThemes.includes(theme)}
                    onChange={() => toggleTheme(theme)}
                  />
                  {theme}
                </label>
              ))}
            </div>
          </div>

          {/* Blocked Topics */}
          <div className="blocked-group">
            <label>Blocked Topics:</label>
            <div className="checkbox-controls">
              <button className="small-btn" onClick={selectAllBlocked}>
                Select All
              </button>
              <button className="small-btn" onClick={deselectAllBlocked}>
                Deselect All
              </button>
            </div>
            <div className="checkbox-grid">
              {enums?.storyConfig?.blockedTopics?.map((topic) => (
                <label key={topic}>
                  <input
                    type="checkbox"
                    checked={blockedTopics.includes(topic)}
                    onChange={() => toggleBlockedTopic(topic)}
                  />
                  {topic}
                </label>
              ))}
            </div>
          </div>

          <button
            className="save-btn save-btn-single"
            onClick={handleStorySave}
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
};

export default Settings;
