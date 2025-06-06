import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, Square, Download } from "lucide-react";
import "./StoryRenderingView.css";

const StoryRenderingView = ({ onBackToSettings, generateStory }) => {
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(false);

  // OpenAI TTS states
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [words, setWords] = useState([]);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioError, setAudioError] = useState(null);



  // Audio refs
  const audioRef = useRef(null);
  const timeUpdateIntervalRef = useRef(null);

  useEffect(() => {
    const story = generateStory;
    setStoryData(story);
    setLoading(false);
    console.log("Current Story:", generateStory);
    // Prepare words for highlighting from content
    if (story.content) {
      const cleanStory = story.content
        .replace(/\n\n/g, " ")
        .replace(/\n/g, " ");
      setWords(cleanStory.split(" "));
    }

    // Only set up audio if buffer exists, but don't auto-generate
    if (story.audioBuffer) {
      console.log("Audio buffer available", story.audioBuffer);
      setAudioError(null);
    }
  }, [generateStory]);

  const generateAudio = async () => {
    if (!storyData || audioLoading || !storyData.audioBuffer) return;

    setAudioLoading(true);
    console.log("Generating audio for story:", storyData.title);
    
    try {
      const uint8Array = new Uint8Array(storyData.audioBuffer.data);
      const blob = new Blob([uint8Array], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      }

      if (audioError) {
        setAudioError(null);
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      setAudioError("Failed to generate audio");
    } finally {
      setAudioLoading(false);
    }
  };

  // Calculate word timing based on audio progress
  const calculateWordTiming = () => {
    if (!audioDuration || !words.length) return;

    // Estimate words per second
    const wordsPerSecond = words.length / audioDuration;
    const currentWordIndex = Math.floor(currentTime * wordsPerSecond);

    setCurrentWordIndex(Math.min(currentWordIndex, words.length - 1));
  };

  // Audio event handlers
  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      calculateWordTiming();
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentWordIndex(-1);
    setCurrentTime(0);
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
    }
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
  };

  const handleAudioError = () => {
    setAudioError("Failed to load audio");
    setAudioLoading(false);
    setIsPlaying(false);
  };

  // Playback controls
  const startReading = async () => {
    if (!audioUrl) {
      await generateAudio();
      return;
    }

    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error("Error playing audio:", error);
        setAudioError("Failed to play audio");
      }
    }
  };

  const pauseReading = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stopReading = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentWordIndex(-1);
    setCurrentTime(0);
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = `${storyData.title || "story"}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
    };
  }, [audioUrl]);

  const renderStoryWithHighlighting = (story) => {
    const paragraphs = story.split("\n\n");
    let globalWordIndex = 0;

    return paragraphs.map((paragraph, paraIndex) => {
      const paraWords = paragraph.split(" ");
      const highlightedParagraph = paraWords.map((word, wordIndex) => {
        const isCurrentWord = globalWordIndex === currentWordIndex;
        const isReadWord = globalWordIndex < currentWordIndex;

        globalWordIndex++;

        return (
          <span
            key={`${paraIndex}-${wordIndex}`}
            className={`story-word ${
              isCurrentWord
                ? "current-word"
                : isReadWord
                ? "read-word"
                : "unread-word"
            }`}
          >
            {word}{" "}
          </span>
        );
      });

      return <p key={paraIndex}>{highlightedParagraph}</p>;
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <div className="story-loading">Loading your magical story...</div>;
  }

  if (!storyData) {
    return (
      <div className="story-error">
        Loading your magical story...
      </div>
    );
  }

  const { metadata, content, imageUrl, title } = storyData;

  return (
    <div className="rendered-story-container">
      <div className="story-header">
        <h1>{title || "Your Magical Story"}</h1>
        <p>
          Character: {metadata.character} | Theme: {metadata.theme} | Setting: {metadata.setting}
        </p>
      </div>

      <div className="story-illustration">
        <img src={imageUrl} alt="Story Illustration" />
      </div>

      {/* OpenAI TTS Controls */}
      <div className="read-aloud-controls">
        {!audioUrl ? (
          <button
            onClick={generateAudio}
            className="read-control-btn generate-audio"
            disabled={audioLoading || !storyData.audioBuffer}
          >
            {audioLoading ? (
              <>⏳ Generating Audio...</>
            ) : (
              <>🎵 Start Read-Along</>
            )}
          </button>
        ) : (
          <>
            <button
              onClick={isPlaying ? pauseReading : startReading}
              className={`read-control-btn ${isPlaying ? "playing" : ""}`}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? "Pause" : "Play Story"}
            </button>

            <button
              onClick={stopReading}
              className="read-control-btn"
              disabled={!isPlaying && currentTime === 0}
            >
              <Square size={16} />
              Stop
            </button>

            <button
              onClick={downloadAudio}
              className="read-control-btn download-btn"
              title="Download Audio"
            >
              <Download size={16} />
              Download
            </button>
          </>
        )}

        {audioError && (
          <div className="audio-error" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
            {audioError}
          </div>
        )}

        {isPlaying && audioDuration > 0 && (
          <div className="reading-progress">
            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(audioDuration)}
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(currentTime / audioDuration) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onLoadedMetadata={handleAudioLoadedMetadata}
        onTimeUpdate={handleAudioTimeUpdate}
        onEnded={handleAudioEnded}
        onPlay={handleAudioPlay}
        onPause={handleAudioPause}
        onError={handleAudioError}
        style={{ display: "none" }}
      />

      <div className="story-text">{renderStoryWithHighlighting(content)}</div>

      <button onClick={onBackToSettings} className="back-btn">
        Back to story settings
      </button>
    </div>
  );
};

export default StoryRenderingView;

/** @ai-generated 
  Base code of this component was AI generated
  Tool: ChatGPT
  Link: https://chatgpt.com/share/683cc78b-78ac-8002-b4ee-7ab15bd48502
  Prompt, short version: "I need to create a StoryRenderingView component. Code it based on this info from the backend developer (I am responsible for the frontend part)" 
  Generated on: 2025-06-01
  Modified by: Tetiana Korchynska
  Modifications: made changes in css mainly, added OpenAI TTS integration with word highlighting
  Verified: Yes, the code met my expectations */
