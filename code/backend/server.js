require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const cors = require('cors');

// express app
const app = express();

// listen for requests
const port = process.env.PORT || 5000;

// Allow specific origin for CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://velvety-entremet-8ac832.netlify.app'],
  credentials: true 
}));

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
 
  app.listen(port, () => {
    console.log('listening on http://localhost:' + port);
  });

  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.log(err); 
})

app.get('/', (req, res) => {
  res.json({ message: 'listening on http://localhost:' + port});
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

