const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const router = express.Router();

// Demo users for testing (when MongoDB is not available)
const demoUsers = {
  'Rom@example.com': { password: 'password123', username: 'Rom', fullName: 'Rom User' },
  'sara@example.com': { password: 'sara123', username: 'Sara', fullName: 'Sara User' },
  'test@example.com': { password: 'test123', username: 'test', fullName: 'Test User' },
  'ram@test.com': { password: 'test123', username: 'ram', fullName: 'Ram' }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check demo mode first
    if (demoUsers[email]) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Add to demo users
    demoUsers[email] = { password, username, fullName };
    const token = generateToken(email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: email,
        username,
        email,
        fullName,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Signup failed',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check demo users
    const demoUser = demoUsers[email];

    if (!demoUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (demoUser.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: email,
        username: demoUser.username,
        email,
        fullName: demoUser.fullName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: { id: req.user.id, message: 'Demo Mode' },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
