import express from 'express';
import cors from "cors";
import 'dotenv/config';
import connectDB from './db/db.js';
import session from 'express-session';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.route.js';
import passport from './config/passport.js';

const PORT = process.env.PORT || 8000;
console.log(PORT)

const app = express();

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
app.use('/api/upload', uploadRoutes);

// Connect to database 
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to database:', error);
});
