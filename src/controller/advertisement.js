const Advertisement = require('../models/advertisement');

exports.createTopAds = async (req, res) => {

  const { bannerOption, bannerItem } = req.body;
  const { category } = req.params
  console.log("category",category);
  // If the brand name doesn't exist, save it
  const topBannerData = new Advertisement({
    bannerOption,
    bannerItem,
    category
  });

  topBannerData.save((error, savedTopBannerData) => {
    if (error) {
      return res.status(400).json({ error: 'Error saving top banner data' });
    }
    if (savedTopBannerData) {
      return res.status(201).json({ topBannerData: savedTopBannerData });
    }
  });
};
exports.getTopAds = async (req, res) => {
  try {
    const { category } = req.params;
    const ads = await Advertisement.find({ category });
    // console.log('Retrieved Ads:', ads); // Add this line for debugging
    res.status(200).json( ...ads );
  } catch (error) {
    console.error('Error fetching top ads:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
