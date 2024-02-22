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
  const { name, brandBannerImg } = req.body;

  // Check if the brand name already exists (case-insensitive)
  const isExists = await isBrandNameExists(name);

  if (isExists) {
    return res.status(400).json({ error: "Brand name already exists." });
  }

  // If the brand name doesn't exist, save it
  const brandName = new BrandName({
    name,
    brandBannerImg
  });

  brandName.save((error, savedBrandName) => {
    if (error) return res.status(400).json({ error });
    if (savedBrandName) {
      res.status(201).json({ brandName: savedBrandName });
    }
  });
};

exports.getBrandByName = async (req, res) => {
  const { name } = req.params;

  try {
    const brand = await BrandName.findOne({ name });

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.status(200).json({ brand });
  } catch (error) {
    console.error("Error fetching brand by name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getBrandName = async (req, res) => {
  try {
    const brandNames = await BrandName.find({}); // Retrieve only the 'name' field

    res.status(200).json({ brandNames });
  } catch (error) {
    console.error("Error fetching brand names:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.deleteBrandName = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the brand name exists
    const existingBrand = await BrandName.findById(id);
    if (!existingBrand) {
      return res.status(404).json({ error: "Brand name not found." });
    }

    // Delete the brand name
    await existingBrand.remove();

    res.status(200).json({ message: "Brand name deleted successfully." });
  } catch (error) {
    console.error("Error deleting brand name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateBrandName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Check if the brand name exists
    const existingBrand = await BrandName.findById(id);
    if (!existingBrand) {
      return res.status(404).json({ error: "Brand name not found." });
    }

    // Check if the updated brand name already exists (case-insensitive)
    const isExists = await isBrandNameExists(name);
    if (isExists) {
      return res.status(400).json({ error: "Brand name already exists." });
    }

    // Update the brand name
    existingBrand.name = name;
    const updatedBrand = await existingBrand.save();

    res.status(200).json({ brandName: updatedBrand });
  } catch (error) {
    console.error("Error updating brand name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
