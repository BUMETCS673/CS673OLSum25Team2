const mongoose = require("mongoose");

const { Schema } = mongoose;

const StorySchema = new Schema(
  {
    storyId: {
      type: String,
      required: true,
      unique: true,
      default: () =>
        `STORY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    summary: {
      type: String,
      maxlength: 500,
    },

    // Story parameters
    character: {
      type: String,
      required: true,
      trim: true,
    },
    setting: {
      type: String,
      required: true,
      trim: true,
    },
    theme: {
      type: String,
      required: true,
      trim: true,
    },
    ageGroup: {
      type: String,
      default: "3-5",
      enum: ["3-5", "5-8", "8-12"],
    },

    // Generated content metadata
    wordCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Image metadata
    imageUrl: {
      type: String,
    },
    imageStyle: {
      type: String,
      default: "watercolor",
      enum: [
        "watercolor",
        "cartoon",
        "realistic",
        "fantasy",
        "oil-painting",
        "sketch",
      ],
    },
    revisedPrompt: {
      type: String,
      maxlength: 1000,
    },

    // Audio metadata
    audioUrl: {
      type: String,
    },
    audioBuffer: {
      type: Buffer, // Store audio as binary data
      required: false, // Optional, can be generated later
    },
    audioVoice: {
      type: String,
      enum: ["alloy", "echo", "fable", "nova", "onyx", "shimmer"],
      default: "nova",
    },
    audioModel: {
      type: String,
      enum: ["tts-1", "tts-1-hd"],
      default: "tts-1",
    },
    audioFormat: {
      type: String,
      enum: ["mp3", "opus", "aac", "flac", "wav"],
      default: "mp3",
    },
    audioDuration: {
      type: Number, // in seconds
      min: 0,
    },
    audioFileSize: {
      type: Number, // in bytes
      min: 0,
    },

    // User interaction
    readCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    playCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: [
        "adventure",
        "educational",
        "fantasy",
        "bedtime",
        "moral",
        "funny",
        "scary",
        "friendship",
      ],
      default: "bedtime",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Story", StorySchema);

