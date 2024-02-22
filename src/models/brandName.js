const mongoose = require("mongoose");
const brandNameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brandBannerImg: {
      type: String,
    },

    // slug: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },

  },
  { timestamps: true }
);

module.exports = mongoose.model("brandName", brandNameSchema);
