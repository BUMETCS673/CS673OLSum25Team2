require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

// express app
const app = express();

// middleware
app.use(express.json());

// connect to mongodb
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  // listen for requests
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port 3000');
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

// register a route
app.get('/', (req, res) => {
  res.send('Hello World!');
});
