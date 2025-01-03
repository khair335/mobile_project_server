const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const deviceDataSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  href: {
    type: String,
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
  visitorCount: {
    type: Number,
    default: 0,
  },
  favCount: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      userName: { type: String, required: true },
      userImage: { type: String },
      userEmail:{ type: String,required: true },
      comment: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    }
  ],
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
