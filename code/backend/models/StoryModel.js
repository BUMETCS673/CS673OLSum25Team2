const mongoose = require('mongoose');
const { Schema } = mongoose;

const StorySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  childId: {
    type: Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storyParameters: {
    characters: [{
      name: String,
      role: String,
      description: String
    }],
    setting: String,
    theme: String
  },
  mediaResources: [{
    type: {
      type: String,
      enum: ['image', 'audio'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    duration: {
      type: Number // only for audio
    }
  }],
  readCount: {
    type: Number,
    default: 0
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  isShared: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', StorySchema);