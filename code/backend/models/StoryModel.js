const mongoose = require("mongoose");
const { Schema } = mongoose;

const StorySchema = new Schema({
  storyId: {
    type: String,
    required: true,
    unique: true,
    default: () => `STORY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  
  // Story parameters
  character: {
    type: String,
    required: true
  },
  setting: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    required: true
  },
  ageGroup: {
    type: String,
    default: '3-5',
    enum: ['3-5', '5-8']
  },
  
  // Generated content metadata
  wordCount: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String
  },
  imageStyle: {
    type: String,
    default: 'watercolor',
    enum: ['watercolor', 'cartoon', 'realistic', 'fantasy']
  },
  revisedPrompt: {
    type: String
  },
  
  // Status and flags
  isComplete: {
    type: Boolean,
    default: false
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  isAudioAvailable: {
    type: Boolean,
    default: false
  },
  
  // Generation metadata
  generationTime: {
    type: Number // in milliseconds
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
   readCount: {
      type: Number,
      default: 0,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
}, {
  timestamps: true
});
   
module.exports = mongoose.model("Story", StorySchema);
