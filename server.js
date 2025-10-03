require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const router = require('./router/auth');
const contact = require('./router/contact');
const animeRoutes = require("./router/animeRoutes")

const app = express();

// CORS setup
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
  credentials: true,
};
app.use(cors(corsOptions));

// Parse JSON body
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('<h1>Hello New</h1>');
});

app.use('/', router);
app.use('/', contact);
app.use('/api/userAnime',animeRoutes);

app.get('/web', (req, res) => {
  res.send('<h1>Welcome to Web</h1>');
});

// Mongo connection + server start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5001, () => {
      console.log('Server is running on port 5001');
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
