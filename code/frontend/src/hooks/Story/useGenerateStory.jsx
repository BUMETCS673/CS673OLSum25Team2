import { useState } from "react";
import { useStoryContext } from "../../hooks/Story/useStoryContext";
import { useAuthContext } from "../../hooks/Auth/useAuthContext";

export const useGenerateStory = () => {
  const { dispatch } = useStoryContext();
  const [errorStory, setErrorStory] = useState(null);
  const [errorImage, setErrorImage] = useState(null);
  const [errorAudio, setErrorAudio] = useState(null);
  const [isLoadingStory, setIsLoadingStory] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(null);
  const [isAudioComplete, setIsAudioComplete] = useState(false);
  const [isImageComplete, setIsImageComplete] = useState(false);
  const [isStoryComplete, setIsStoryComplete] = useState(false);

  const { user } = useAuthContext();

  const generateStory = async (generationParams) => {
    setIsLoadingStory(true);
    setErrorStory(null);

    try {
      // Check if user is authenticated
      const BASE_URL =
        window.location.protocol === "file:" ||
        window.location.hostname === "localhost"
          ? "http://localhost:5500"
          : "https://mymagicalbedtime-25abceb2c11f.herokuapp.com";

      const response = await fetch(`${BASE_URL}/api/stories/generate/story`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          character: generationParams.selectedCharacter,
          theme: generationParams.selectedTheme,
          setting: generationParams.selectedSetting,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoadingStory(false);
        setErrorStory(json.error);
        return;
      }

      // Validate the required properties
      if (!json || !json.content || !json.imageDescription || !json.storyId) {
        console.error("Missing required properties in response:", {
          hasContent: !!json?.content,
          hasImageDescription: !!json?.imageDescription,
          hasStoryId: !!json?.storyId,
          json: json,
        });
        setErrorStory("Invalid response from server");
        return;
      }
      setIsStoryComplete(true);
      console.log("Generated Story:", json);

      // Execute generateImage and generateAudio concurrently
      const [generateImageJson, generateAudioJson] = await Promise.all([
        generateImage({
          storyId: json.storyId,
          imageDescription: json.imageDescription,
        }),
        generateAudio({
          storyId: json.storyId,
          text: json.content,
        }),
      ]);

      console.log("Generated Image:", generateImageJson);
      console.log("Generated Audio:", generateAudioJson);

      // Validate that both functions returned valid results
      if (!generateImageJson?.imageUrl) {
        console.error("generateImage did not return a valid imageUrl");
        setIsLoadingStory(false);
        setErrorStory("Failed to generate image");
        return;
      }

      if (!generateAudioJson?.audioBuffer) {
        console.error("generateAudio did not return a valid audioBuffer");
        setIsLoadingStory(false);
        setErrorStory("Failed to generate audio");
        return;
      }

      const ImgURL = generateImageJson.imageUrl;
      const AudioBuffer = generateAudioJson.audioBuffer;

      console.log("ImgURL:", ImgURL);
      console.log("AudioBuffer:", AudioBuffer);

      // Dispatch the generated story to the context
      dispatch({
        type: "GENERATE_STORY",
        payload: {
          storyId: json.storyId,
          content: json.content,
          imageDescription: json.imageDescription,
          imageUrl: ImgURL,
          audioBuffer: AudioBuffer,
          audioUrl: generateAudioJson.audioUrl,
          metadata: json.metadata,
          summary: json.summary,
          title: json.title,
          wordCount: json.wordCount,
        },
      });

      setIsLoadingStory(false);
     
    } catch (error) {
      console.error("Error in generateStory:", error);
      setIsLoadingStory(false);
      setErrorStory("An unexpected error occurred");
    }
  };

  const generateImage = async (imageParams) => {
    setIsLoadingImage(true);
    setErrorImage(null);

    const BASE_URL =
      window.location.protocol === "file:" ||
      window.location.hostname === "localhost"
        ? "http://localhost:5500"
        : "https://mymagicalbedtime-25abceb2c11f.herokuapp.com";

    const response = await fetch(`${BASE_URL}/api/stories/generate/image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        imageDescription: imageParams.imageDescription,
        storyId: imageParams.storyId,
      }),
    });
    const json = await response.json();
    if (!response.ok) {
      setIsLoadingImage(false);
      setErrorImage(json.error);
    }

    if (response.ok) {
      console.log("Generated Image:", json);
      setIsLoadingImage(false);
      setIsImageComplete(true);
      return json; // Return the generated image URL
    }
  };

  const generateAudio = async (audioParams) => {
    setIsLoadingAudio(true);
    setErrorAudio(null);

    const BASE_URL =
      window.location.protocol === "file:" ||
      window.location.hostname === "localhost"
        ? "http://localhost:5500"
        : "https://mymagicalbedtime-25abceb2c11f.herokuapp.com";

    const response = await fetch(`${BASE_URL}/api/stories/generate/audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        storyId: audioParams.storyId,
        text: audioParams.text,
      }),
    });

    const json = await response.json();
    if (!response.ok) {
      setIsLoadingAudio(false);
      setErrorAudio(json.error);
    }

    if (response.ok) {
      console.log("Generated Audio:", json);
      setIsLoadingAudio(false);
      setIsAudioComplete(true);
      return json; // Return the generated audio URL
    }
  };

  const resetGenerateStory = () => {
    dispatch({ type: "RESET_GENERATE_STORY" });
  };

  return {
    resetGenerateStory,
    generateStory,
    isLoadingStory,
    isStoryComplete,
    isLoadingImage,
    isImageComplete,
    isLoadingAudio,
    isAudioComplete,
    errorStory,
    errorImage,
    errorAudio,
  };
};
