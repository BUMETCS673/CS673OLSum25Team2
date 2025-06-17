const mongoose = require('mongoose');
const { Schema } = mongoose;

const GenerationRequestSchema = new Schema({
  requestId: {
    type: String,
    required: true,
    unique: true,
    default: () => `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Request parameters
  parameters: {
    character: String,
    setting: String,
    theme: String,
    ageGroup: String,
    style: String,
    // Audio parameters
    voice: {
      type: String,
      enum: ['alloy', 'echo', 'fable', 'nova', 'onyx', 'shimmer'],
      default: 'nova'
    },
    audioModel: {
      type: String,
      enum: ['tts-1', 'tts-1-hd'],
      default: 'tts-1'
    },
    audioFormat: {
      type: String,
      enum: ['mp3', 'opus', 'aac', 'flac', 'wav'],
      default: 'mp3'
    }
  },
  
  // Generation results
  results: {
    storyGenerated: { type: Boolean, default: false },
    imageGenerated: { type: Boolean, default: false },
    audioGenerated: { type: Boolean, default: false },
    
    // File upload results
    imageUploaded: { type: Boolean, default: false },
    audioUploaded: { type: Boolean, default: false },
    
    // Error tracking
    storyError: String,
    imageError: String,
    audioError: String,
    imageUploadError: String,
    audioUploadError: String,
    
    // Generated content metadata
    wordCount: Number,
    estimatedAudioDuration: Number, // in seconds
    
    // File URLs (Firebase Storage)
    imageUrl: String,
    audioUrl: String,
    
    // OpenAI metadata
    openaiImageUrl: String, // Original OpenAI image URL
    revisedPrompt: String
  },
  
  // Performance tracking
  timing: {
    startTime: Date,
    endTime: Date,
    duration: Number, // Total duration in milliseconds
  },
    
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'partial', 'failed'],
    default: 'pending'
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('GenerationRequest', GenerationRequestSchema);