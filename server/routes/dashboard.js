import express from 'express';
import Image from '../models/Image.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total cases (total images uploaded by user)
    const totalCases = await Image.countDocuments({ userId });

    // Get all images with predictions for the user
    const images = await Image.find({ userId });

    // Calculate disease breakdown
    const diseaseBreakdown = {};
    let healthyCount = 0;
    let infectedCount = 0;

    images.forEach(image => {
      if (image.analysisResult && image.analysisResult.predicted_class) {
        const predictedClass = image.analysisResult.predicted_class.toLowerCase();
        if (predictedClass !== 'healthy' && predictedClass !== 'normal') {
          // Count as infected
          infectedCount++;
          const disease = image.analysisResult.predicted_class;
          diseaseBreakdown[disease] = (diseaseBreakdown[disease] || 0) + 1;
        } else {
          // Count as healthy
          healthyCount++;
        }
      } else {
        // If no analysis result, count as healthy for now
        healthyCount++;
      }
    });

    // Calculate healthy percentage
    const healthyPercentage = totalCases > 0 ? Math.round((healthyCount / totalCases) * 100) : 100;

    // Generate monthly trend data (last 6 months) - infected cases only
    const monthlyTrend = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
      
      // Get images for the specific month
      const monthImages = await Image.find({
        userId,
        uploadDate: {
          $gte: targetDate,
          $lt: nextMonth
        }
      });

      // Count only infected cases for this month
      let monthInfectedCases = 0;
      monthImages.forEach(image => {
        if (image.analysisResult && image.analysisResult.predicted_class) {
          const predictedClass = image.analysisResult.predicted_class.toLowerCase();
          if (predictedClass !== 'healthy' && predictedClass !== 'normal') {
            monthInfectedCases++;
          }
        }
      });

      monthlyTrend.push({
        month: months[targetDate.getMonth()],
        cases: monthInfectedCases
      });
    }

    res.json({
      totalCases,
      healthyPercentage,
      activeAlerts: infectedCount,
      diseaseBreakdown,
      monthlyTrend
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

export default router;
