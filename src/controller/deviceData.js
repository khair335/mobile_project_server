const DevicesData = require('../models/deviceData'); // Import your Mongoose model

// Create a new devicesData
exports.createDevice = async (req, res) => {
  try {
    const { deviceName, ...otherDeviceData } = req.body;

    // Check if a device with the same name already exists
    const existingDevice = await DevicesData.findOne({ deviceName });

    if (existingDevice) {
      return res.status(400).json({ error: 'Device with this name already exists' });
    }

    // Create and save the new device
    const newDevice = new DevicesData({
      deviceName,
      ...otherDeviceData,
    });

    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (error) {
    console.error('Error creating device:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// Get all devicesData
exports.getAllDevices = async (req, res) => {
  try {
    const devices = await DevicesData.find();
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error getting devices:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get a specific devicesData by ID
exports.getDeviceById = async (req, res) => {
  const deviceId = req.params.id;
  try {
    const device = await DevicesData.findById(deviceId);
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    res.status(200).json(device);
  } catch (error) {
    console.error('Error getting device by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a devicesData by ID
exports.updateDeviceById = async (req, res) => {
  const deviceId = req.params.id;
  console.log("deviceId",deviceId);
  try {
    const updatedDevice = await DevicesData.findByIdAndUpdate(deviceId, req.body, { new: true });
    if (!updatedDevice) {
      return res.status(404).json({ error: 'Device not found' });
    }
    res.status(200).json(updatedDevice);
  } catch (error) {
    console.error('Error updating device by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a devicesData by ID
exports.deleteDeviceById = async (req, res) => {
  const deviceId = req.params.id;
  try {
    const deletedDevice = await DevicesData.findByIdAndDelete(deviceId);
    if (!deletedDevice) {
      return res.status(404).json({ error: 'Device not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting device by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get only deviceName, banner_img, and _id for all devices
exports.getAllDevicesName = async (req, res) => {
    try {
      const devices = await DevicesData.find({}, 'deviceName banner_img _id brand status');
      res.status(200).json(devices);
    } catch (error) {
      console.error('Error getting devices:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


exports.getBrandNameWiseData = async (req, res) => {
 try {
    const brandName = req.params.brandName;
    const devices = await DevicesData.find({ brand:  { $regex: new RegExp(`^${brandName}$`, 'i') }  },'deviceName banner_img _id brand');

    res.status(200).json(devices);
  } catch (error) {
    console.error('Error getting devices by brand:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
