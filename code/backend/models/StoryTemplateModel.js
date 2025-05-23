const mongoose = require('mongoose');
const { Schema } = mongoose;

const StoryTemplateSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['adventure', 'friendship', 'educational', 'bedtime', 'seasonal', 'emotions', 'family', 'animals', 'fantasy', 'problem_solving'],
    default: 'adventure'
  },
  templateContent: {
    type: String,
    required: true
  },
  placeholders: [String],
  ageRange: {
    min: {
      type: Number,
      default: 3
    },
    max: {
      type: Number,
      default: 5
    }
  },
  possibleCharacters: [{
    type: String,
    enum: [
      'bunny', 'bear', 'puppy', 'kitten', 'duck',
      'princess', 'fairy', 'dragon', 'unicorn', 'superhero'
    ]
  }],
  possibleSettings: [{
    type: String,
    enum: [
      'forest', 'garden', 'beach', 'castle', 'treehouse',
      'playground', 'space', 'underwater', 'magical_land', 'bedroom'
    ]
  }],
  possibleThemes: [{
    type: String,
    enum: [
      'friendship', 'kindness', 'courage', 'sharing', 'helping',
      'counting', 'colors', 'animals', 'family', 'trying_new_things'
    ]
  }],
  educationalGoals: [{
    type: String,
    enum: [
      'vocabulary_building', 'number_skills', 'social_skills', 'emotional_intelligence',
      'problem_solving', 'creativity', 'listening_skills', 'moral_values',
      'self_confidence', 'independence'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StoryTemplate', StoryTemplateSchema);
