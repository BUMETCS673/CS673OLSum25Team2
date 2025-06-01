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
    style: String
  },
  
  // Generation results
  results: {
    storyGenerated: { type: Boolean, default: false },
    imageGenerated: { type: Boolean, default: false },
    storyError: String,
    imageError: String
  },
  
  // Performance tracking
  timing: {
    startTime: Date,
    endTime: Date,
    duration: Number
  },
  
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GenerationRequest', GenerationRequestSchema);