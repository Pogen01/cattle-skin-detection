import express from 'express';
import passport from 'passport';

const router = express.Router();

// Google OAuth login route
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/?error=auth_failed' }),
  (req, res) => {
    // Successful authentication, redirect to homepage
    res.redirect('http://localhost:3000/');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session destruction failed' });
      }
      res.clearCookie('connect.sid');
      res.redirect('http://localhost:3000');
    });
  });
});

// Check authentication status
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      _id: req.user._id,
      googleId: req.user.googleId,
      name: req.user.name,
      email: req.user.email,
      profileImage: req.user.profileImage
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;
