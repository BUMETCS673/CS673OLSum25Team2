const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChildSchema = new Schema({
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 3,
    max: 5
  },
  preferences: {
    favoriteCharacters: [String],
    favoriteThemes: [String],
    favoriteSettings: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Child', ChildSchema);