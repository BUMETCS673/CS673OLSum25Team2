require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
// express app
const app = express();

// middleware
app.use(express.json());

// routes
app.use('/api/user', userRoutes);

// connect to mongodb
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  // listen for requests
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log('listening on http://localhost:' + port);
  });

  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.log(err); 
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

