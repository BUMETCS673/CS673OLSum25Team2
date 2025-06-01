import React, { useEffect, useState } from "react";
import "./StoryRenderingView.css";

const StoryRenderingView = ({ onBackToSettings }) => {
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  // VARIANT A: Placeholder (for UI work)
  //  Comment it out / delete when the work on API is finished
  useEffect(() => {
    // Simulate backend data
    const fakeData = {
      success: true,
      metadata: {
        character: "Bunny",
        theme: "Animals",
        setting: "City",
      },
      story: `Once upon a time, in a bustling city far, far away, there lived a small, soft bunny named Benny...

Even though he was surrounded by tall buildings and busy streets, Benny had made his home in a quiet, green park...

That night, Benny looked around at his new bunny friends, cuddled up in their burrows. He felt a warmth in his heart.

So, my dear little ones, wherever you are, remember, you can always find happiness, just like Benny the Bunny.`,
      imageUrl: "/characters/bunny.png",
    };

    setStoryData(fakeData);
    setLoading(false);
  }, []);

  // === VARIANT B: Real backend (to uncomment later) ===
  /*
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch("http://localhost:5500/api/stories/generate");
        const data = await response.json();
        if (data.success) {
          setStoryData(data);
        } else {
          console.error("Story generation failed");
        }
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, []);
  */

  if (loading) {
    return <div className="story-loading">Loading your magical story...</div>;
  }

  if (!storyData) {
    return (
      <div className="story-error">
        Oops! Failed to load story. Please try again.
      </div>
    );
  }

  const { metadata, story, imageUrl } = storyData;

  return (
    <div className="rendered-story-container">
      <div className="story-header">
        <h1>Your Magical Story</h1>
        <p>
          Character: {metadata.character} | Theme: {metadata.theme} | Setting:{" "}
          {metadata.setting}
        </p>
      </div>

      <div className="story-illustration">
        <img src={imageUrl} alt="Story Illustration" />
      </div>

      <div className="story-text">
        {story.split("\n\n").map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>
      <button onClick={onBackToSettings}>Back to story settings</button>
    </div>
  );
};

export default StoryRenderingView;

/** @ai-generated 
Base code of this component was AI generated
Tool: ChatGPT
Link: https://chatgpt.com/share/683cc78b-78ac-8002-b4ee-7ab15bd48502
Prompt, short version: “I need to create a StoryRenderingView component. Code it based on this info from the backend developer (I am responsible for the frontend part)" 
Generated on: 2025-06-01
Modified by:  Tetiana Korchynska
Modifications: made changes in css mainly
Verified:  Yes, the code met my expectations */
