// Load environment variables from .env file
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" }); // Load .env file at the very top

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes'); 


const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration (if needed)
const corsOptions = {
  origin: 'http://localhost:3000', // your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));


app.use(cors());

// Ensure MONGO_URL is being loaded correctly
const mongoUrl = process.env.MONGO_URL;
const port = process.env.PORT || 4000;

// Check if MONGO_URL is defined
if (!mongoUrl) {
  console.error('MONGO_URL is not defined in the .env file');
  process.exit(1); // Exit if the environment variable is missing
}

// Connect to MongoDB
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

// Use item routes for the API
app.use('/api/items', itemRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
