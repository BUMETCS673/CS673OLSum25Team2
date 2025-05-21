const mongoose = require('mongoose');
const { Schema } = mongoose;

const StoryTemplateSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
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
  possibleCharacters: [String],
  possibleSettings: [String],
  possibleThemes: [String],
  educationalGoals: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StoryTemplate', StoryTemplateSchema);
