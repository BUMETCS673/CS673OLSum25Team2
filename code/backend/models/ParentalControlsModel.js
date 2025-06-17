const mongoose = require('mongoose');
const { Schema } = mongoose;

const ParentalControlsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Text-to-Speech Configuration
  ttsConfig: {
    voice: {
      type: String,
      enum: ['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer'],
      default: 'nova'
    },
    model: {
      type: String,
      enum: ['tts-1', 'tts-1-hd', 'gpt-4o-mini-tts'],
      default: 'tts-1'
    }
  },
  
  // Image Generation Controls
  imageConfig: {
    model: {
      type: String,
      enum: ['dall-e-2', 'dall-e-3', 'gpt-image-1'],
      default: 'dall-e-2'
    }
  },
  
  // Story Generation Parameters
  storyConfig: {
    wordCount: {
      type: Number,
      default: 300,
      min: 150,
      max: 500
    },
    
    // Appropriate themes that are allowed
    allowedThemes: {
      type: [String],
      enum: [
        'Friendship',
        'Adventure', 
        'Kindness',
        'Animals',
        'Magic',
        'Helping Others',
        'Bravery',
        'Imagination',
        'Bedtime',
        'Learning',
        'Sharing',
        'Curiosity',
        'Nature',
        'Superheroes',
        'Creativity'
      ],
      default: [
        'Friendship',
        'Adventure', 
        'Kindness',
        'Animals',
        'Magic',
        'Helping Others',
        'Bravery',
        'Imagination',
        'Bedtime',
        'Learning',
        'Sharing',
        'Curiosity',
        'Nature',
        'Superheroes',
        'Creativity'
      ]
    },
    
    // Topics that are blocked/restricted
    blockedTopics: {
      type: [String],
      enum: [
        'Violence',
        'Scary Elements',
        'Dark Magic',
        'Bullying',
        'Sad Endings',
        'Loneliness',
        'Dangerous Adventures',
        'Inappropriate Humor',
        'Loss / Death',
        'Nightmares',
        'Strong Emotions',
        'Complex Relationships',
        'Conflict',
        'Stereotypes',
        'Fear of Monsters'
      ],
      default: []
    }
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
ParentalControlsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ParentalControls', ParentalControlsSchema);