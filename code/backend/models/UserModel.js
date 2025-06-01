const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

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
  },
  // Login attempt limiting fields
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true // Automatically create createdAt and updatedAt fields
});
// static register method
UserSchema.statics.signup = async function(email, password, firstName, lastName) {
  // validation
  if (!email || !password || !firstName || !lastName) {
    throw Error('All fields must be filled');
  }if (!validator.isEmail(email)) {
    throw Error('Email is not valid');
  }
  // password validation (8 characters, 1 number, 1 special character)
  if (!validator.isStrongPassword(password)) {
    throw Error('Password is not strong enough ');
  }
 
  // check if email already exists
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error('Email already exists');
  }

  // use bcrypt for password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // create user
  const user = await this.create({ email, password: hash, firstName, lastName });

  return user;
};

// static login method
UserSchema.statics.login = async function(email, password) {
  // check if email exists
  const user = await this.findOne({ email });
  
  if (!user) {
    throw Error('No account found with this email address. Please check your spelling or create a new account.');
  }

  // Check if account is currently locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60)); // minutes
    throw Error(`Account is temporarily locked due to too many failed login attempts. Try again in ${lockTimeRemaining} minutes.`);
  }

  // check if password is correct
  const match = await bcrypt.compare(password, user.password);
  
  if (!match) {
    // Increment failed login attempts
    const updates = { $inc: { loginAttempts: 1 } };
    
    // Set lock if we've reached max attempts and account isn't already locked
    const maxAttempts = 5; // Maximum failed attempts before lock
    const lockTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (user.loginAttempts + 1 >= maxAttempts && (!user.lockUntil || user.lockUntil < Date.now())) {
      updates.$set = { lockUntil: Date.now() + lockTime };
    }
    
    await this.findByIdAndUpdate(user._id, updates);
    
    const attemptsLeft = maxAttempts - (user.loginAttempts + 1);
    if (attemptsLeft > 0) {
      throw Error(`The password you entered is incorrect. You have ${attemptsLeft} attempts remaining before your account is temporarily locked.`);
    } else {
      throw Error('The password you entered is incorrect. Your account has been temporarily locked for 5 minutes due to too many failed attempts.');
    }
  }

  // Successful login - reset login attempts and remove lock
  if (user.loginAttempts > 0 || user.lockUntil) {
    await this.findByIdAndUpdate(user._id, {
      $unset: { loginAttempts: 1, lockUntil: 1 }
    });
  }

  return user;
};

module.exports = mongoose.model('User', UserSchema);