import { useState } from "react";
import CharacterCarousel from "./CharacterCarousel";
import "./StoryCustomizationInterface.css";
import StoryRenderingView from "../StoryRenderingView/StoryRenderingView";

// Theme and setting options
const themes = [
  "Friendship",
  "Adventure",
  "Kindness",
  "Animals",
  "Magic",
  "Helping Others",
  "Bravery",
  "Imagination",
  "Bedtime",
  "Learning",
  "Sharing",
  "Curiosity",
  "Nature",
  "Superheroes",
  "Creativity",
];

const settings = [
  "Forest",
  "Castle",
  "Underwater",
  "Space",
  "Playground",
  "Farm",
  "City",
  "Mountain",
  "Pirate Ship",
  "Home",
  "Jungle",
  "Beach",
  "Zoo",
  "Treehouse",
  "Library",
];

const StoryCustomizationInterface = () => {
  // UI state for current menu and user selections
  const [activeMenu, setActiveMenu] = useState("character");
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [storyGenerated, setStoryGenerated] = useState(false);

  // Check if all options are selected before enabling the GENERATE A STORY button
  const isReady = selectedCharacter && selectedTheme && selectedSetting;

  // Trigger story generation view
  const generateStoryHandler = () => {
    console.log(selectedCharacter, selectedTheme, selectedSetting);
    setStoryGenerated(true);
  };

  // Renders content in the right panel based on current active menu
  // (charater, there, or setting selection)
  const renderRightPanel = () => {
    if (activeMenu === "character") {
      return (
        <CharacterCarousel
          onSelect={setSelectedCharacter}
          selected={selectedCharacter}
        />
      );
    }

    if (activeMenu === "theme") {
      return (
        <div className="option-grid">
          {themes.map((theme) => (
            <button
              key={theme}
              className={`option-button ${
                selectedTheme === theme ? "selected" : ""
              }`}
              onClick={() => setSelectedTheme(theme)}
            >
              {theme}
            </button>
          ))}
        </div>
      );
    }

    if (activeMenu === "setting") {
      return (
        <div className="option-grid">
          {settings.map((setting) => (
            <button
              key={setting}
              className={`option-button ${
                selectedSetting === setting ? "selected" : ""
              }`}
              onClick={() => setSelectedSetting(setting)}
            >
              {setting}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="story-container">
      <div className="story-panel">
        {storyGenerated ? (
          // Show the story view once generated
          <StoryRenderingView
            onBackToSettings={() => setStoryGenerated(false)}
          />
        ) : (
          <>
            <div className="panel-content">
              {/* Left MENU panel */}
              <div className="left-menu">
                <p>Choose your story's: </p>
                <div className="left-buttons">
                  <button
                    onClick={() => setActiveMenu("character")}
                    className={activeMenu === "character" ? "active" : ""}
                  >
                    CHARACTER
                  </button>
                  <button
                    onClick={() => setActiveMenu("theme")}
                    className={activeMenu === "theme" ? "active" : ""}
                  >
                    THEME
                  </button>
                  <button
                    onClick={() => setActiveMenu("setting")}
                    className={activeMenu === "setting" ? "active" : ""}
                  >
                    SETTING
                  </button>
                </div>
              </div>

              {/* Right panel with selections */}
              <div className="right-panel">{renderRightPanel()}</div>
            </div>

            <button
              className="generate-btn"
              onClick={generateStoryHandler}
              disabled={!isReady}
            >
              GENERATE A STORY
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StoryCustomizationInterface;

/** @ai-generated 
Basic structure of the component was AI generated
Tool: ChatGPT
Link: https://chatgpt.com/share/6838b589-87c8-8002-ac0c-8f94252a74dc
Prompt, short version: “Based on the information sent, return a component with the story customization interface" 
Generated on: 2025-05-29
Modified by:  Tetiana Korchynska
Modifications: Made changes on top of the AI generated code
Verified:  Reviewed, partially edited*/
