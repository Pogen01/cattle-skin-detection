import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected dashboard route
router.get('/dashboard', requireAuth, (req, res) => {
  res.json({
    message: 'Dashboard access granted',
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profileImage: req.user.profileImage || req.user.picture
    }
  });
});

// Check authentication status
router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profileImage: req.user.profileImage || req.user.picture
    }
  });
});

export default router;
