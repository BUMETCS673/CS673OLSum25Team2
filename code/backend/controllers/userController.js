const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
}

// login user
const loginUser = async(req, res) => {

  const { email, password } = req.body;
  
  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// register user
const registerUser = async (req, res) => {

  const { email, password, firstName, lastName } = req.body;

  try {
    const user = await User.register(email, password, firstName, lastName);

    // create token
    const token = createToken(user._id);

    res.status(200).json({email, token});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  res.json({ message: 'User registered' });
}

// logout user
const logoutUser = (req, res) => {
  res.json({ message: 'User logged out' });
}


module.exports = {
  loginUser,
  registerUser,
  logoutUser
}