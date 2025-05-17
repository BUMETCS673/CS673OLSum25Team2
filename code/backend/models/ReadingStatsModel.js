const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReadingStatsSchema = new Schema({
  childId: {
    type: Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  storiesRead: [{
    storyId: {
      type: Schema.Types.ObjectId,
      ref: 'Story'
    },
    duration: {
      type: Number // in seconds
    },
    completed: {
      type: Boolean
    }
  }],
  totalDuration: {
    type: Number // in seconds
  },
  achievements: [String]
});

module.exports = mongoose.model('ReadingStats', ReadingStatsSchema);