const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Load testimonials from JSON file
const testimonialsPath = path.join(__dirname, '../data/testimonials.json');

/**
 * GET /api/reviews
 * Fetches all reviews from testimonials.json
 */
router.get('/reviews', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(testimonialsPath, 'utf8'));
    
    res.json({
      success: true,
      data: {
        businessName: data.businessName,
        rating: data.rating,
        totalReviews: data.totalReviews,
        location: data.location,
        reviews: data.reviews
      },
      lastUpdated: new Date(fs.statSync(testimonialsPath).mtime).toISOString()
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to load reviews'
    });
  }
});

/**
 * GET /api/reviews/:limit
 * Fetches limited number of latest reviews
 */
router.get('/reviews/:limit', (req, res) => {
  try {
    const { limit } = req.params;
    const numLimit = Math.min(parseInt(limit) || 5, 50);

    const data = JSON.parse(fs.readFileSync(testimonialsPath, 'utf8'));
    
    // Get the most recent reviews (reverse order)
    const latestReviews = data.reviews.slice(-numLimit).reverse();

    res.json({
      success: true,
      data: {
        businessName: data.businessName,
        rating: data.rating,
        totalReviews: data.totalReviews,
        location: data.location,
        reviews: latestReviews
      },
      requestedLimit: numLimit,
      returnedCount: latestReviews.length,
      lastUpdated: new Date(fs.statSync(testimonialsPath).mtime).toISOString()
    });
  } catch (error) {
    console.error('Error fetching limited reviews:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
