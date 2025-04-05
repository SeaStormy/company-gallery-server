const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Check if any admin exists
router.get('/check-setup', async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    res.json({ needsSetup: adminCount === 0 });
  } catch (error) {
    console.error('Setup check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create initial superuser (protected by setup token)
router.post('/setup', async (req, res) => {
  try {
    const { email, password, setupToken } = req.body;

    // Verify setup token
    if (setupToken !== process.env.SETUP_TOKEN) {
      return res.status(401).json({ message: 'Invalid setup token' });
    }

    // Check if any admin already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res
        .status(400)
        .json({ message: 'Initial setup already completed' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create superuser
    const admin = new Admin({
      email,
      password: hashedPassword,
      isSuperuser: true,
    });

    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, isSuperuser: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, isAdmin: true, isSuperuser: true });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, isSuperuser: admin.isSuperuser },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, isAdmin: true, isSuperuser: admin.isSuperuser });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify admin token
router.post('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ isAdmin: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(401).json({ isAdmin: false });
    }

    res.json({ isAdmin: true, isSuperuser: admin.isSuperuser });
  } catch (error) {
    res.status(401).json({ isAdmin: false });
  }
});

module.exports = router;
