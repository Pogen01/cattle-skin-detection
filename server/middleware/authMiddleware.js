export const requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  return res.status(401).json({ 
    error: 'Authentication required',
    message: 'You must be logged in to access this resource'
  });
};

export const getCurrentUser = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    req.currentUser = req.user;
  }
  next();
};
