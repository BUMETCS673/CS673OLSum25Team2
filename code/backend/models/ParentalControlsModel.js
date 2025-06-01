const mongoose = require('mongoose');
const { Schema } = mongoose;

const ParentalControlsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentFiltering: {
    type: Boolean,
    default: true
  },
  restrictedThemes: [String],
  restrictedWords: [String],
  maxStoryDuration: {
    type: Number // in minutes
  },
  dailyReadingLimit: {
    type: Number // in minutes, optional
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ParentalControls', ParentalControlsSchema);