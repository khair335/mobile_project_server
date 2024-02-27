const express = require('express');
const { createTopAds, getTopAds, getAdsByCategory } = require('../controller/advertisement');
const router = express.Router();

// Define routes
router.post('/create-ads/:category', createTopAds);
router.get('/get-ads/:category', getTopAds);

// Create Top Ads
// router.post('/create-ads/:category', createTopAds);

// // Get Ads by Category
// router.get('/get-ads/:category', getAdsByCategory);
module.exports = router;
