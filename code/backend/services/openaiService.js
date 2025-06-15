const OpenAI = require("openai");
const parentalControls = require("../models/ParentalControlsModel");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate a bedtime story using OpenAI's GPT-4 model
const generateStoryWithOpenAI = async ({
  character,
  setting,
  theme,
  userId,
  ageGroup = "3-5",
}) => {
  try {
    console.log(userId);
    // Fetch parental controls for the user
    const controls = await parentalControls.findOne({ userId });

    console.log(controls);
    // Get word count from parental controls
    const wordCount = controls.storyConfig.wordCount;

    // Build content filtering instructions
    const contentFilteringPrompt = controls.storyConfig.blockedTopics
      ? `IMPORTANT: This story must be completely safe for children. Avoid any content related to: ${controls.storyConfig.blockedTopics.join(
          ", "
        )}. ` +
        `Keep the story positive, gentle, and appropriate for the specified age group.`
      : "";

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a talented children's bedtime story writer. Create engaging, gentle, and age-appropriate stories that help children relax and fall asleep. Keep stories positive, educational, and calming. ${contentFilteringPrompt}`,
        },
        {
          role: "user",
          content: `Write a bedtime story for children aged ${ageGroup} featuring:
- Main character: ${character}
- Setting: ${setting}
- Theme/lesson: ${theme}

CONTENT GUIDELINES:
- Word count: approximately ${wordCount} words
- Only include themes from this approved list: ${controls.storyConfig.allowedThemes.join(
            ", "
          )}
- Completely avoid these topics: ${controls.storyConfig.blockedTopics.join(
            ", "
          )}

Please respond in this exact JSON format:
{
  "title": "A catchy, child-friendly title",
  "story": "The complete bedtime story here...",
  "summary": "A brief 1-2 sentence summary of the story",
  "imageDescription": "A detailed description of an illustration for this story, suitable for an AI image generator. Include the main Character : ${character}, Setting: ${setting} , Theme/lesson: ${theme}, mood, colors, and style appropriate for children's book illustration."
}
Make it approximately ${wordCount} words, with simple language and a peaceful ending that encourages sleep.`,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });
    console.log(
      "OpenAI story generation response:",
      completion.choices[0].message.content
    );
    // Parse the JSON response
    const parsedResponse = completion.choices[0].message.content;
    return parsedResponse;
  } catch (error) {
    console.error("OpenAI story generation error:", error);
    throw new Error(`Story generation failed: ${error.message}`);
  }
};

// Generate an image using OpenAI's DALL-E model with the imageDescription
const generateImageWithOpenAI = async (imageDescription, userId) => {
  try {
    // Add emphasis on no text to the existing image description
    const enhancedPrompt = `${imageDescription} Pure visual illustration only - no text, no words, no letters, no titles, no captions, no speech bubbles, no written elements of any kind.`;
    const controls = await parentalControls.findOne({ userId });

    const newModel =
      controls.imageConfig.model === "gpt-image-1"
        ? "dall-e-3"
        : controls.imageConfig.model;
        
    // const newQuality = controls.imageConfig.model === 'gpt-image-1' ? 'auto' : 'standard';
    // const newQuality = newModel === 'gpt-image-1' ? 'auto' : 'standard';

    let result;
    if (newModel === "dall-e-3") {
        result = await openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });
    }else {
        result = await openai.images.generate({
        model: "dall-e-2",
        prompt: enhancedPrompt,
        size: "1024x1024",
        n: 1,
      });
    }

    return {
      imageUrl: result.data[0].url,
      revisedPrompt: result.data[0].revised_prompt,
    };
  } catch (error) {
    console.error("OpenAI image generation error:", error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
};

// Generate audio using OpenAI's TTS model
const generateAudioWithOpenAI = async ({
  text,
  voice,
  model,
  responseFormat,
  speed,
}) => {
  try {
    console.log(
      `Generating audio with text: ${text}, voice: ${voice}, model: ${model}, format: ${responseFormat}`
    );

    function cleanTextForAudio(text) {
      return (
        text
          // Remove or replace problematic punctuation
          .replace(/'/g, "'") // Replace curly quotes with straight quotes
          .replace(/"/g, '"') // Replace curly quotes with straight quotes
          .replace(/['']/g, "'") // Normalize apostrophes
          .replace(/[""]/g, '"') // Normalize quotation marks

          // Add pauses for better speech flow
          .replace(/\. /g, ". ") // Ensure space after periods
          .replace(/\? /g, "? ") // Ensure space after question marks
          .replace(/! /g, "! ") // Ensure space after exclamation marks

          // Handle dialogue attribution for better flow
          .replace(/, he said/g, " he said") // Remove comma before attribution
          .replace(/, she said/g, " she said")
          .replace(/, they said/g, " they said")

          // Clean up extra whitespace
          .replace(/\s+/g, " ") // Replace multiple spaces with single space
          .trim()
      ); // Remove leading/trailing whitespace
    }

    const response = await openai.audio.speech.create({
      input: cleanTextForAudio(text),
      voice: voice,
      model: model,
      response_format: responseFormat,
      speed: speed,
    });

    // Get the audio as a buffer
    const buffer = Buffer.from(await response.arrayBuffer());

    return {
      audioBuffer: buffer,
      contentType: getContentType(responseFormat),
      voice: voice,
      model: model,
      format: responseFormat,
      textLength: text.length,
      estimatedDuration: Math.ceil(text.split(" ").length / 150) * 60, // Rough estimate in seconds
    };
  } catch (error) {
    console.error("OpenAI audio generation error:", error);
    throw new Error(`Audio generation failed: ${error.message}`);
  }
};

// Helper function to get content type based on format
const getContentType = (format) => {
  const contentTypes = {
    mp3: "audio/mpeg",
    opus: "audio/opus",
    aac: "audio/aac",
    flac: "audio/flac",
    wav: "audio/wav",
  };
  return contentTypes[format] || "audio/mpeg";
};

module.exports = {
  generateStoryWithOpenAI,
  generateImageWithOpenAI,
  generateAudioWithOpenAI,
};
