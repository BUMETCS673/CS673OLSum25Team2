const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true // Automatically create createdAt and updatedAt fields
});

// static register method
UserSchema.statics.register = async function(email, password, firstName, lastName) {
  // check if email already exists
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error('Email already exists');
  }

  // use bcrypt for password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // create user
  const user = await this.add({ email, password: hash, firstName, lastName });

  return user;
};

// static login method
UserSchema.statics.login = async function(email, password) {
  // check if email exists
  const user = await this.findOne({ email });

  if (!user) {
    throw Error('Incorrect email');
  }

  // check if password is correct
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
};

module.exports = mongoose.model('User', UserSchema);