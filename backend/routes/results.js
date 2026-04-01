const express = require('express');
const Result = require('../models/Result');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// File-based storage for results when MongoDB is not available
const storageFile = path.join(__dirname, '../storage/results.json');

const loadResults = () => {
  try {
    if (fs.existsSync(storageFile)) {
      const data = fs.readFileSync(storageFile, 'utf8');
      return JSON.parse(data || '{}');
    }
    return {};
  } catch (error) {
    console.log('Error loading results file:', error.message);
    return {};
  }
};

const saveResultsFile = (data) => {
  try {
    fs.writeFileSync(storageFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Error saving results file:', error.message);
  }
};

let fileResults = loadResults();

// @route   POST /api/results
// @desc    Store quiz results
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { courseId, courseName, score, totalQuestions, answers, duration } =
      req.body;

    // Validation
    if (
      !courseId ||
      !courseName ||
      score === undefined ||
      !totalQuestions ||
      !answers
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const percentage = (score / totalQuestions) * 100;
    const status = percentage >= 50 ? 'passed' : 'failed';

    try {
      // Try to save to MongoDB
      const result = new Result({
        userId: req.user.id,
        courseId,
        courseName,
        score,
        totalQuestions,
        percentage: Math.round(percentage),
        answers,
        duration: duration || 0,
        status,
      });

      await result.save();

      res.status(201).json({
        success: true,
        message: 'Result saved successfully',
        result,
      });
    } catch (dbError) {
      // File-based storage fallback
      const resultId = `result_${Date.now()}`;
      const result = {
        _id: resultId,
        userId: req.user.id,
        courseId,
        courseName,
        score,
        totalQuestions,
        percentage: Math.round(percentage),
        answers,
        duration: duration || 0,
        status,
        createdAt: new Date(),
      };

      if (!fileResults[req.user.id]) {
        fileResults[req.user.id] = [];
      }
      fileResults[req.user.id].push(result);
      saveResultsFile(fileResults);

      res.status(201).json({
        success: true,
        message: 'Result saved successfully (File Storage)',
        result,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/results
// @desc    Get all results for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    try {
      // Try to get from MongoDB
      const results = await Result.find({ userId: req.user.id }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        count: results.length,
        results,
      });
    } catch (dbError) {
      // File storage fallback
      const results = fileResults[req.user.id] || [];

      res.status(200).json({
        success: true,
        count: results.length,
        results,
        message: 'Results from File Storage',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/results/:id
// @desc    Get a specific result by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    try {
      // Try to get from MongoDB
      const result = await Result.findById(req.params.id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Result not found',
        });
      }

      // Check authorization
      if (result.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this result',
        });
      }

      res.status(200).json({
        success: true,
        result,
      });
    } catch (dbError) {
      // File storage fallback
      const userResults = fileResults[req.user.id] || [];
      const result = userResults.find(r => r._id === req.params.id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Result not found',
        });
      }

      res.status(200).json({
        success: true,
        result,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/results/course/:courseId
// @desc    Get all results for a specific course
// @access  Private
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    try {
      // Try to get from MongoDB
      const results = await Result.find({
        userId: req.user.id,
        courseId: parseInt(req.params.courseId),
      }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: results.length,
        results,
      });
    } catch (dbError) {
      // File storage fallback
      const userResults = fileResults[req.user.id] || [];
      const results = userResults.filter(
        r => r.courseId === parseInt(req.params.courseId)
      );

      res.status(200).json({
        success: true,
        count: results.length,
        results,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
