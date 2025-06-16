const Story = require("../models/StoryModel");
const parentalControls = require("../models/ParentalControlsModel");
const GenerationRequest = require("../models/GenerationRequestModel");
const {
  generateStoryWithOpenAI,
  generateImageWithOpenAI,
  generateAudioWithOpenAI,
} = require("../services/openaiService");
const {
  saveImageFile,
  deleteImageFile,
  saveAudioFile,
  deleteAudioFile,
  checkAudioFileExists,
} = require("../services/firebaseStorageService");

const generateStory = async (req, res) => {
  const startTime = Date.now();
  let generationRequest;
  console.log(req.validatedData);

  try {
    const {
      character,
      setting,
      theme,
      ageGroup = "3-5",
      style = "watercolor",
      childId,
    } = req.validatedData;
    const userId = req.user._id;

    console.log("Generating story content for:", {
      character,
      setting,
      theme,
      ageGroup,
    });

    // Create generation request record
    generationRequest = new GenerationRequest({
      userId,
      parameters: { character, setting, theme, ageGroup, style },
      timing: { startTime: new Date(startTime) },
      status: "processing",
      results: {},
    });
    await generationRequest.save();

    // Generate story only
    let storyData = null;

    try {
      // Generate story with imageDescription
      const storyResponse = await generateStoryWithOpenAI({
        character,
        setting,
        theme,
        ageGroup,
        userId,
      });

      // Debug logging
      console.log("Story generation raw response:", storyResponse);
      console.log("Type of storyResponse:", typeof storyResponse);

      // Parse the response if it's a string
      if (typeof storyResponse === "string") {
        try {
          // Clean the JSON string before parsing
          let cleanedResponse = storyResponse
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t")
            .replace(/\f/g, "\\f")
            .replace(/\b/g, "\\b")
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"');

          // Alternative approach: try to extract JSON from the response
          const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            cleanedResponse = jsonMatch[0];
          }

          console.log("Attempting to parse cleaned response...");
          storyData = JSON.parse(cleanedResponse);
          console.log("Successfully parsed story data:", storyData);
        } catch (parseError) {
          console.error(
            "Failed to parse story response after cleaning:",
            parseError
          );
          console.log(
            "Original response:",
            storyResponse.substring(0, 500) + "..."
          );

          // Fallback: try to manually extract the data using regex
          try {
            console.log("Attempting manual extraction...");
            const titleMatch = storyResponse.match(/"title":\s*"([^"]+)"/);
            const storyMatch = storyResponse.match(
              /"story":\s*"([\s\S]*?)(?=",\s*"summary")/
            );
            const summaryMatch = storyResponse.match(/"summary":\s*"([^"]+)"/);
            const imageDescMatch = storyResponse.match(
              /"imageDescription":\s*"([\s\S]*?)(?="\s*})/
            );

            if (titleMatch && storyMatch && summaryMatch && imageDescMatch) {
              storyData = {
                title: titleMatch[1],
                story: storyMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"'),
                summary: summaryMatch[1],
                imageDescription: imageDescMatch[1]
                  .replace(/\\n/g, "\n")
                  .replace(/\\"/g, '"'),
              };
              console.log("Manual extraction successful:", storyData);
            } else {
              throw new Error("Could not extract story data from response");
            }
          } catch (extractError) {
            console.error("Manual extraction failed:", extractError);
            throw new Error(
              "Invalid story response format - could not parse or extract data"
            );
          }
        }
      } else {
        storyData = storyResponse;
      }

      // Validate that we have the required fields
      if (
        !storyData ||
        !storyData.story ||
        !storyData.title ||
        !storyData.imageDescription
      ) {
        console.error("Missing required fields in story data:", storyData);
        throw new Error("Incomplete story data received");
      }

      // Update generation request for successful story
      generationRequest.results.storyGenerated = true;
    } catch (storyError) {
      console.error("Story generation failed:", storyError);
      generationRequest.results.storyError =
        storyError.message || "Unknown error";
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    const response = {
      success: true,
      generatedAt: new Date().toISOString(),
      generationTime: duration,
      metadata: { character, setting, theme, ageGroup, style },
    };

    // Process story result
    let savedStory = null;

    if (storyData) {
      const wordCount = storyData.story.split(" ").length;

      response.title = storyData.title;
      response.content = storyData.story;
      response.summary = storyData.summary;
      response.imageDescription = storyData.imageDescription;
      response.wordCount = wordCount;

      // Save story to database (without image/audio)
      savedStory = new Story({
        userId,
        childId: childId || null,
        title: storyData.title,
        content: storyData.story,
        summary: storyData.summary,
        imageDescription: storyData.imageDescription,
        character,
        setting,
        theme,
        ageGroup,
        wordCount,
        imageUrl: null, // Will be set when image is generated
        imageStyle: style,
        audioBuffer: null, // Will be set when audio is generated
        audioUrl: null, // Will be set when audio is generated
        revisedPrompt: null, // Will be set when image is generated
        isComplete: false, // Story only, not complete until image/audio added
        generationTime: duration,
        generatedAt: new Date(),
      });

      await savedStory.save();
      response.storyId = savedStory._id;
    } else {
      response.success = false;
      response.storyError = "Failed to generate story";
    }

    // Update generation request with final status
    generationRequest.timing.endTime = new Date(endTime);
    generationRequest.timing.duration = duration;
    generationRequest.status = storyData ? "completed" : "failed";
    await generationRequest.save();

    res.json(response);
  } catch (error) {
    console.error("Error generating story:", error);

    // Update generation request with error
    if (generationRequest) {
      generationRequest.status = "failed";
      generationRequest.timing.endTime = new Date();
      generationRequest.timing.duration = Date.now() - startTime;
      await generationRequest.save();
    }

    res.status(500).json({
      success: false,
      error: "Failed to generate story",
    });
  }
};

const generateImage = async (req, res) => {
  const startTime = Date.now();
  const { imageDescription, storyId } = req.body;
  const userId = req.user._id;
  console.log(imageDescription, storyId);
  try {
    console.log("Generating image for story:", storyId, imageDescription);

    // Generate image
    const imageResult = await generateImageWithOpenAI(imageDescription, userId);

    if (!imageResult || !imageResult.imageUrl) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate image",
      });
    }

    // Upload image to storage
    let imageDownloadUrl = null;
    try {
      imageDownloadUrl = await saveImageFile(imageResult.imageUrl, storyId);
    } catch (uploadError) {
      console.error("Failed to upload image to storage:", uploadError);
      return res.status(500).json({
        success: false,
        error: "Failed to upload image to storage",
        details:
          process.env.NODE_ENV === "development"
            ? uploadError.message
            : undefined,
      });
    }

    // Update story with image information
    const updates = {
      imageUrl: imageDownloadUrl,
      revisedPrompt: imageResult.revisedPrompt,
    };

    await Story.findByIdAndUpdate(storyId, updates);

    const endTime = Date.now();
    const duration = endTime - startTime;

    res.json({
      success: true,
      storyId: Story._id,
      imageUrl: imageDownloadUrl,
      revisedPrompt: imageResult.revisedPrompt,
      generationTime: duration,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate image",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const generateAudio = async (req, res) => {
  const startTime = Date.now();
  const { text, storyId } = req.body;

  const userId = req.user._id;

  try {
    console.log("Generating audio for story:", storyId, text);
    const controls = await parentalControls.findOne({ userId });

    // Generate audio
    const audioResult = await generateAudioWithOpenAI({
      text: text,
      voice: controls.ttsConfig.voice,
      model: controls.ttsConfig.model,
      responseFormat: "mp3",
      speed: 0.8,
    });

    if (!audioResult || !audioResult.audioBuffer) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate audio - no audio buffer received",
      });
    }

    console.log(
      "Audio generation completed, received buffer of size:",
      audioResult.audioBuffer.length
    );

    // Upload audio to storage
    let audioDownloadUrl = null;
    try {
      audioDownloadUrl = await saveAudioFile(audioResult.audioBuffer, storyId);
    } catch (uploadError) {
      console.error("Failed to upload audio to storage:", uploadError);
      return res.status(500).json({
        success: false,
        error: "Failed to upload audio to storage",
      });
    }

    // Update story with audio information
    const updates = {
      audioUrl: audioDownloadUrl,
    };

    await Story.findByIdAndUpdate(storyId, updates);

    const endTime = Date.now();
    const duration = endTime - startTime;

    res.json({
      storyId: storyId,
      audioUrl: audioDownloadUrl,
      audioBuffer: audioResult.audioBuffer,
      generationTime: duration,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating audio:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate audio",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get user's stories
const getUserStories = async (req, res) => {
  try {
    const userId = req.user._id;

    const query = { userId };

    const stories = await Story.find(query).sort({ createdAt: -1 });
    response = {
      success: true,
      total: stories.length,
      stories: stories.map((story) => ({
        storyId: story._id,
        title: story.title,
        content: story.content,
        summary: story.summary,
        imageUrl: story.imageUrl,
        audioUrl: story.audioUrl,
        createdAt: story.createdAt,
        character: story.character,
        setting: story.setting,
        theme: story.theme,
        wordCount: story.wordCount,
        isFavorite: story.isFavorite,
      })),
    };
    res.json({
      response,
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch stories",
    });
  }
};

// Get specific story
const getStory = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user.id;

    const story = await Story.findOne({ _id: id, userId });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    customResponse = {
      storyId: story._id,
      title: story.title,
      content: story.content,
      summary: story.summary,
      audioBuffer: story.audioBuffer,
      imageDescription: story.imageDescription,
      imageDownloadUrl: story.imageUrl,
      audioDownloadUrl: story.audioUrl,
      metadata: {
        character: story.character,
        setting: story.setting,
        theme: story.theme,
        ageGroup: story.ageGroup,
      },
      wordCount: story.wordCount,
      imageStyle: story.imageStyle,
      isFavorite: story.isFavorite,
      createdAt: story.createdAt,
    };
    res.json({
      story: customResponse,
    });
  } catch (error) {
    console.error("Error fetching story:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch story",
    });
  }
};

// Save story to favorites
const saveStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFavorite } = req.body; // Get isFavorite from request body
    const userId = req.user.id;

    // Validate isFavorite parameter
    if (typeof isFavorite !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isFavorite must be a boolean value (true or false)",
      });
    }

    // Update the story's favorite status
    const story = await Story.findOneAndUpdate(
      { _id: id, userId },
      { isFavorite: isFavorite }
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const allStories = await Story.find({ userId }).sort({ createdAt: -1 });

    response = {
      success: true,
      total: allStories.length,
      stories: allStories.map((story) => ({
        storyId: story._id,
        title: story.title,
        content: story.content,
        summary: story.summary,
        imageUrl: story.imageUrl,
        audioUrl: story.audioUrl,
        createdAt: story.createdAt,
        character: story.character,
        setting: story.setting,
        theme: story.theme,
        wordCount: story.wordCount,
        isFavorite: story.isFavorite,
      })),
    };

    res.json({
      success: true,
      message: "Story saved to favorites",
      response,
    });
  } catch (error) {
    console.error("Error saving story:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save story",
    });
  }
};

// Delete story
const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const story = await Story.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }
    const allStories = await Story.find({ userId }).sort({ createdAt: -1 });

    response = {
      success: true,
      total: allStories.length,
      stories: allStories.map((story) => ({
        storyId: story._id,
        title: story.title,
        content: story.content,
        summary: story.summary,
        imageUrl: story.imageUrl,
        audioUrl: story.audioUrl,
        createdAt: story.createdAt,
        character: story.character,
        setting: story.setting,
        theme: story.theme,
        wordCount: story.wordCount,
        isFavorite: story.isFavorite,
      })),
    };

    res.json({
      success: true,
      message: "Story deleted successfully",
      response,
    });

    deleteImageFile(story.imageUrl);
    deleteAudioFile(story.audioUrl);
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete story",
    });
  }
};

const generateAudioSample = async (req, res) => {
  try {
    const prompt =
      "Tell me my magical bedtime adventure where I discover a secret door under my pillow that leads to a land of gentle, sleepy creatures.";
    const { try_voice, try_model } = req.body;
    const fileName = try_voice + "_" + try_model;

    const sampleUrl = await checkAudioFileExists(fileName);

    if (sampleUrl) {
      return res.json({
        audioUrl: sampleUrl,
        voice: try_voice,
        model: try_model,
      });
    }

    const audioResult = await generateAudioWithOpenAI({
      text: prompt,
      voice: try_voice,
      model: try_model,
      responseFormat: "mp3",
      speed: 0.8,
    });

    // Upload audio to storage
    let audioDownloadUrl = null;
    try {
      audioDownloadUrl = await saveAudioFile(audioResult.audioBuffer, fileName);
    } catch (uploadError) {
      console.error("Failed to upload audio to storage:", uploadError);
      return res.status(500).json({
        success: false,
        error: "Failed to upload audio to storage",
      });
    }

    res.json({
      audioUrl: audioDownloadUrl,
      voice: try_voice,
      model: try_model,
    });
  } catch (error) {
    console.error("Error generating audio:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate audio",
    });
  }
};
module.exports = {
  generateStory,
  generateAudio,
  generateAudioSample,
  generateImage,
  getUserStories,
  getStory,
  saveStory,
  deleteStory,
};
