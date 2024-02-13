const BrandName = require('../models/brandName');

// Function to check if a brand name already exists
const isBrandNameExists = async (name) => {
  try {
    // Case-insensitive query to find a brand name
    const existingBrand = await BrandName.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    return !!existingBrand;
  } catch (error) {
    console.error("Error checking brand name existence:", error);
    return false;
  }
};

exports.createBrandName = async (req, res) => {
  const { name } = req.body;

  // Check if the brand name already exists (case-insensitive)
  const isExists = await isBrandNameExists(name);

  if (isExists) {
    return res.status(400).json({ error: "Brand name already exists." });
  }

  // If the brand name doesn't exist, save it
  const brandName = new BrandName({
    name,
  });

  brandName.save((error, savedBrandName) => {
    if (error) return res.status(400).json({ error });
    if (savedBrandName) {
      res.status(201).json({ brandName: savedBrandName });
    }
  });
};

exports.getBrandName = (req, res) => {

}


exports.getBrandName = async (req, res) => {
  try {
    const brandNames = await BrandName.find({}, 'name'); // Retrieve only the 'name' field

    res.status(200).json({ brandNames });
  } catch (error) {
    console.error("Error fetching brand names:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};