import express from 'express';
import cors from "cors";
import 'dotenv/config';
import connectDB from './db/db.js';
import session from 'express-session';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.route.js';
import protectedRoutes from './routes/protected.js';
import { requireAuth } from './middleware/authMiddleware.js';
import passport from './config/passport.js';
import axios from 'axios';
import dashboardRoutes from './routes/dashboard.js';

const PORT = process.env.PORT || 8000;
console.log(PORT)

const app = express();

// Communicating with flask Microservice
app.get('/home', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/flask');
    res.send(response.data);
  } catch (error) {
    console.error('Error communicating with Flask server:', error);
    res.status(500).send('Error communicating with Flask server');
  }
});

// Get model information
app.get('/api/model-info', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/model_info');
    res.json(response.data);
  } catch (error) {
    console.error('Error getting model info:', error);
    res.status(500).json({ error: 'Failed to get model information' });
  }
});

// Predict from uploaded image (protected)
app.post('/api/predict', requireAuth, async (req, res) => {
  try {
    const { imagePath } = req.body;
    
    if (!imagePath) {
      return res.status(400).json({ error: 'Image path is required' });
    }

    const response = await axios.post('http://localhost:5000/predict_from_path', {
      image_path: imagePath
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error making prediction:', error);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Failed to make prediction' });
    }
  }
});

// Updated CORS configuration
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials']
}));

app.use(express.json());

// Middlewares
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true, // Prevents XSS attacks
    sameSite: 'lax' // Helps prevent CSRF attacks
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Auth routes
app.use('/auth', authRoutes);
app.use('/api/upload', requireAuth, uploadRoutes);
app.use('/api', protectedRoutes);

// Routes
app.use('/api/dashboard', dashboardRoutes);

// Connect to database 
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to database:', error);
});


