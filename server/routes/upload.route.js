import express from 'express';
import upload from '../middleware/upload.js';
import Image from '../models/Image.js';
import axios from 'axios';

const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User must be authenticated' });
    }

    const userId = req.user.id || req.user._id;

    const imageRecord = new Image({
      userId: userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    await imageRecord.save();

    // Automatically analyze the uploaded image
    try {
      console.log('Attempting to analyze image at path:', req.file.path);
      
      const predictionResponse = await axios.post('http://localhost:5000/predict_from_path', {
        image_path: req.file.path
      });

      console.log('Analysis successful:', predictionResponse.data);

      // Update the image record with analysis results
      imageRecord.analysisResult = predictionResponse.data;
      imageRecord.status = 'analyzed';
      await imageRecord.save();

      res.status(201).json({
        message: 'Image uploaded and analyzed successfully',
        image: {
          id: imageRecord._id,
          filename: imageRecord.filename,
          originalName: imageRecord.originalName,
          uploadDate: imageRecord.uploadDate,
          analysisResult: predictionResponse.data
        }
      });
    } catch (analysisError) {
      console.error('Analysis failed:', analysisError.message);
      if (analysisError.response) {
        console.error('Flask server response:', analysisError.response.data);
      }
      
      imageRecord.status = 'error';
      await imageRecord.save();

      res.status(201).json({
        message: 'Image uploaded but analysis failed',
        image: {
          id: imageRecord._id,
          filename: imageRecord.filename,
          originalName: imageRecord.originalName,
          uploadDate: imageRecord.uploadDate
        },
        analysisError: 'Failed to analyze image'
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

export default router;
