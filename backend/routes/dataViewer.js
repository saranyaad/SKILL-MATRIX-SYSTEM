const express = require('express');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const router = express.Router();

const storageFile = path.join(__dirname, '../storage/results.json');

// Get quiz results for current user only (for dashboard display)
router.get('/view', auth, (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`[DataViewer] Fetching results for user: ${userId}`);
    
    if (fs.existsSync(storageFile)) {
      const data = fs.readFileSync(storageFile, 'utf8');
      const results = JSON.parse(data || '{}');
      
      // Get only current user's results
      const userResults = results[userId] || [];
      
      console.log(`[DataViewer] Found ${userResults.length} results for user ${userId}`);
      console.log(`[DataViewer] Available users in storage:`, Object.keys(results));

      res.status(200).json({
        success: true,
        count: userResults.length,
        results: userResults,
        userId: userId
      });
    } else {
      console.log(`[DataViewer] Storage file doesn't exist`);
      res.status(200).json({
        success: true,
        count: 0,
        results: [],
        userId: userId
      });
    }
  } catch (error) {
    console.error(`[DataViewer] Error:`, error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get raw storage file for admin viewing
router.get('/raw', (req, res) => {
  try {
    if (fs.existsSync(storageFile)) {
      const data = fs.readFileSync(storageFile, 'utf8');
      res.type('application/json').send(data);
    } else {
      res.status(404).json({
        success: false,
        message: 'No data available'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
