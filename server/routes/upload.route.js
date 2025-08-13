import express from 'express';
import upload from '../middleware/upload.js';
import Image from '../models/Image.js';

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

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: {
        id: imageRecord._id,
        filename: imageRecord.filename,
        originalName: imageRecord.originalName,
        uploadDate: imageRecord.uploadDate
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

export default router;
