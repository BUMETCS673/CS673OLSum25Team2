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
  possibleCharacters: {
    type: String,
  },
  possibleSettings: {
    type: String,
  },
  possibleThemes: {
    type: String,
  },
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
