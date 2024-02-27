const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema({
  bannerOption: {
    type: "string",
  },
  bannerItem: {
    type: [String], // Assuming each slider item has an array of image links
    // required: true,
  },
  category: {
       type: "string",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;