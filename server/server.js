const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doubts', require('./routes/doubtRoutes'));
app.use('/api/users', require('./routes/userRoutes'));


// Protected route example
const protect = require('./middlewares/auth');
app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'You have access to this protected route', user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
