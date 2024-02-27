const mongoose = require('mongoose');

const deviceDataSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  deviceName: {
    type: String,
    required: true,
  },
  release_date: {
    type: String,
  },
  banner_img: {
    type: String,
  },
  galleryPhoto: [
    {
      type: String,
    },
  ],
  weight: {
    type: String,
  },
  backCamera: {
    type: String,
  },
  backCameraVideo: {
    type: String,
  },
  battery: {
    type: String,
  },
  chargingSpeed: {
    type: String,
  },
  processor: {
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
      subType: [
        {
          subData: {
            type: String,
          },
          name: {
            type: String,
          },
        },
      ],
    },
  ],
});

const DevicesData = mongoose.model('DevicesData', deviceDataSchema);

module.exports = DevicesData;
