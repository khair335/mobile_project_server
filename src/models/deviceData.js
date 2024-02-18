// models/devicesData.js
const mongoose = require('mongoose');

const devicesDataSchema = new mongoose.Schema({
  deviceName: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  release_date: {
    type: Date,
  },
  banner_img: {
    type: String, // Assuming you store the image URL
  },
  galleryPhoto: [
    {
      data: String, // Assuming you store the image URL
    },
  ],
  weight: {
    type: String,
  },
  thickness: {
    type: String,
  },
  os_android: {
    type: String,
  },
  os_brand: {
    type: String,
  },
  displaySize: {
    type: String,
  },
  displayResolution: {
    type: String,
  },
  expandable_storage: {
    type: String,
    enum: ['yes', 'no'],
  },
  expandable_storage_type: {
    type: String,
  },
  ram: {
    type: String,
  },
  storage: {
    type: String,
  },
  data: [
    {
      type: {
        type: String,
      },
      subType: {
        type: String,
      },
    },
  ],
});

const DevicesData = mongoose.model('DevicesData', devicesDataSchema);

module.exports = DevicesData;
