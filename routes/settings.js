const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Get settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        logo: '',
        landingPageImage: '',
        landingPageTitle: 'Welcome to Our Company',
        landingPageDescription: 'Discover our amazing products',
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings
router.put(
  '/',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'landingPageImage', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { landingPageTitle, landingPageDescription, notification } =
        req.body;
      let settings = await Settings.findOne();

      if (!settings) {
        settings = new Settings();
      }

      // Handle file uploads
      if (req.files) {
        if (req.files.logo) {
          const logoResult = await cloudinary.uploader.upload(
            req.files.logo[0].path,
            {
              folder: 'company_portal/settings',
            }
          );
          settings.logo = logoResult.secure_url;
          fs.unlinkSync(req.files.logo[0].path);
        }

        if (req.files.landingPageImage) {
          const imageResult = await cloudinary.uploader.upload(
            req.files.landingPageImage[0].path,
            {
              folder: 'company_portal/settings',
            }
          );
          settings.landingPageImage = imageResult.secure_url;
          fs.unlinkSync(req.files.landingPageImage[0].path);
        }
      }

      // Update other fields
      settings.landingPageTitle = landingPageTitle;
      settings.landingPageDescription = landingPageDescription;
      if (notification) {
        settings.notification = JSON.parse(notification);
      }

      settings.updatedAt = new Date();
      await settings.save();

      res.json(settings);
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
