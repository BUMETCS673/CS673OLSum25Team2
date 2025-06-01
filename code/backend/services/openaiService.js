const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate a bedtime story using OpenAI's GPT-4 model
const generateStoryWithOpenAI = async ({
  character,
  setting,
  theme,
  ageGroup = "3-5",
}) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a talented children's bedtime story writer. Create engaging, gentle, and age-appropriate stories that help children relax and fall asleep. Keep stories positive, educational, and calming.`,
        },
        {
          role: "user",
          content: `Write a bedtime story for children aged ${ageGroup} featuring:
- Main character: ${character}
- Setting: ${setting}
- Theme/lesson: ${theme}

Make it approximately 150-300 words, with simple language and a peaceful ending that encourages sleep.`,
        },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI story generation error:", error);
    throw new Error(`Story generation failed: ${error.message}`);
  }
};

// Generate an image using OpenAI's DALL-E model
const generateImageWithOpenAI = async ({
  character,
  setting,
  theme,
  style,
}) => {
  try {
    // Strategy 1: Multiple "no text" reinforcements
    const prompt1 = `A beautiful children's book illustration in ${style} style showing ${character} in ${setting}, conveying ${theme}. Gentle, dreamy, child-friendly, perfect for bedtime story. Soft colors, peaceful atmosphere. Pure illustration with no text, no words, no letters, no writing whatsoever.`;

    // Strategy 2: Emphasize visual elements instead
    const prompt2 = `Pure visual ${style} illustration of ${character} in ${setting} expressing ${theme}. Focus on colors, shapes, and visual storytelling only. Children's book art style with soft, dreamy atmosphere. Visual narrative without any text elements, letters, or written words.`;

    // Strategy 3: Specific exclusions
    const prompt3 = `${style} children's book illustration: ${character} in ${setting} showing ${theme}. Dreamy, gentle, child-friendly scene with soft colors and peaceful mood. Image only - exclude all text, titles, captions, speech bubbles, signs, labels, and written content.`;

    // Strategy 4: Descriptive visual focus
    const prompt4 = `Wordless ${style} illustration for children showing ${character} peacefully in ${setting}, capturing the essence of ${theme}. Rich visual details, soft lighting, gentle colors. Pure artwork without typography, text overlays, or any written elements.`;
    const result = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt1,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    return {
      imageUrl: result.data[0].url,
      revisedPrompt: result.data[0].revised_prompt,
    };
  } catch (error) {
    console.error("OpenAI image generation error:", error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
};

module.exports = {
  generateStoryWithOpenAI,
  generateImageWithOpenAI,
};
