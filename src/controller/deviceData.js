const DevicesData = require("../models/deviceData"); // Import your Mongoose model
const UserModel = require("../models/userModel"); // Import your Mongoose model
const mongoose = require('mongoose');
// Create a new devicesData
exports.createDevice = async (req, res) => {
  try {
    const { deviceName, ...otherDeviceData } = req.body;

    // Check if a device with the same name already exists
    const existingDevice = await DevicesData.findOne({ deviceName });

    if (existingDevice) {
      return res
        .status(400)
        .json({ error: "Device with this name already exists" });
    }

    // Create and save the new device
    const newDevice = new DevicesData({
      deviceName,
      ...otherDeviceData,
    });

    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (error) {
    console.error("Error creating device:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all devicesData
exports.getAllDevices = async (req, res) => {
  try {
    const devices = await DevicesData.find();
    res.status(200).json(devices);
  } catch (error) {
    console.error("Error getting devices:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific devicesData by ID
exports.getDeviceById = async (req, res) => {
  const deviceId = req.params.id;
  try {
    const device = await DevicesData.findById(deviceId);
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.status(200).json(device);
  } catch (error) {
    console.error("Error getting device by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a devicesData by ID
exports.updateDeviceById = async (req, res) => {
  const deviceId = req.params.id;

  try {
    const updatedDevice = await DevicesData.findByIdAndUpdate(
      deviceId,
      req.body,
      { new: true }
    );
    if (!updatedDevice) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.status(200).json(updatedDevice);
  } catch (error) {
    console.error("Error updating device by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a devicesData by ID
exports.deleteDeviceById = async (req, res) => {
  const deviceId = req.params.id;
  try {
    const deletedDevice = await DevicesData.findByIdAndDelete(deviceId);
    if (!deletedDevice) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting device by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get only deviceName, banner_img, and _id for all devices
exports.getAllDevicesName = async (req, res) => {
  try {
    const devices = await DevicesData.find(
      {},
      "deviceName banner_img _id brand status favCount"
    );
    res.status(200).json(devices);
  } catch (error) {
    console.error("Error getting devices:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBrandNameWiseData = async (req, res) => {
  try {
    const brandName = req.params.brandName;
    const devices = await DevicesData.find(
      { brand: { $regex: new RegExp(`^${brandName}$`, "i") } },
      "deviceName banner_img _id brand"
    );

    res.status(200).json(devices);
  } catch (error) {
    console.error("Error getting devices by brand:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const extractNumericPrice = (subData) => {
  const match = subData.match(/([A-Z]+)\s*[-=]\s*([\d,]+)/);
  return match ? parseFloat(match[2].replace(",", "")) : null;
};

exports.getDevicesByPrice = async (req, res) => {
  try {
    const priceParam = parseFloat(req.params.priceParam) || 0;
    let priceThreshold = parseFloat(req.query.priceThreshold) || 10000;

    // Fetch all devices
    const allDevices = await DevicesData.find(
      {},
      "deviceName banner_img _id brand data"
    );

    // Filter devices based on the priceParam and dynamic priceThreshold
    const filteredDevices = allDevices.filter((device) => {
      // Find the object with type "price"
      const priceObject = device.data.find((item) => item.type === "price");

      // Check if the priceObject has subType array
      if (
        priceObject &&
        priceObject.subType &&
        Array.isArray(priceObject.subType)
      ) {
        // Find the object with subData containing the price value
        const priceDataObject = priceObject.subType.find((subItem) =>
          subItem.subData.includes("BDT")
        );

        // Check if the priceDataObject is found
        if (priceDataObject) {
          // Extract the numeric value from subData
          const numericPrice = extractNumericPrice(priceDataObject.subData);

          // Check if the numericPrice is not null and satisfies the condition
          return numericPrice !== null && numericPrice <= priceParam && numericPrice >= (priceParam - priceThreshold);
        }
      }

      return false; // Filter out devices without valid price information
    });

    const simplifiedDevices = filteredDevices.map((device) => ({
      deviceName: device.deviceName,
      banner_img: device.banner_img,
      _id: device._id,
      brand: device.brand,
    }));

    res.status(200).json(simplifiedDevices);
  } catch (error) {
    console.error("Error getting devices by price:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.updateVisitorCount = async (req, res) => {
  const { deviceId } = req.params;

  try {
    const device = await DevicesData.findById(deviceId);
    // console.log("deviceData", device.deviceName);

    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    device.visitorCount += 1;
    await device.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating visitor count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




exports.updateFavCount = async (req, res) => {
  const { deviceId, userId } = req.params;

  try {
    // Check if deviceId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      return res.status(400).json({ error: "Invalid device ID" });
    }

    // Find the device by ID
    const device = await DevicesData.findById(deviceId);

    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    // Update user's favorite devices
    const userEmail = userId.trim().toLowerCase();
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove the previous favorite if it exists
    if (user.favoriteDevices && user.favoriteDevices.length > 0) {
      const prevFavorites = await DevicesData.find({ _id: { $in: user.favoriteDevices.map(fav => fav._id) } });

      prevFavorites.forEach(async (prevFavorite) => {
        prevFavorite.favCount -= 1;
        await prevFavorite.save();
      });
    }

    // Add the new favorite device
    const newFavorite = {
      _id: device._id,
      brand: device.brand,
      deviceName: device.deviceName,
      banner_img: device.banner_img,
    };

    user.favoriteDevices = user.favoriteDevices || [];
    user.favoriteDevices.push(newFavorite);

    await user.save();

    // Increment favCount for the new favorite device
    device.favCount += 1;
    await device.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating favCount and user favorite:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.removeFavCount = async (req, res) => {
  const { userId, deviceId } = req.params;

  try {
    // Update user's favorite devices
    const userEmail = userId.trim().toLowerCase();
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the index of the device in favoriteDevices array
    const deviceIndex = user.favoriteDevices.findIndex(device => device._id.toString() === deviceId);

    // Check if the device exists in the favoriteDevices array
    if (deviceIndex !== -1) {
      const removedDevice = user.favoriteDevices[deviceIndex];

      // Decrement favCount for the removed device
      const favoriteDevice = await DevicesData.findById(removedDevice._id);

      if (favoriteDevice) {
        favoriteDevice.favCount -= 1;
        await favoriteDevice.save();
      }

      // Remove the device from favoriteDevices array
      user.favoriteDevices.splice(deviceIndex, 1);
      await user.save();

      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: "Device not found in user's favorite devices" });
    }
  } catch (error) {
    console.error("Error removing favorite device:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




const { subDays, startOfDay, endOfDay } = require("date-fns");

exports.getTopDevicesLast10Days = async (req, res) => {
  try {
    // Calculate the start and end dates for the last 10 days
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, 10));

    // Fetch devices with the highest visitor counts within the date range
    const topDevices = await DevicesData.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .sort({ visitorCount: -1 })
      .limit(10)
      .select("deviceName _id brand visitorCount"); // Specify the fields you want

    res.status(200).json(topDevices);
  } catch (error) {
    console.error("Error getting top devices:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTopDevicesByFavLast10Days = async (req, res) => {
  try {
    // Calculate the start and end dates for the last 10 days
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, 10));

    // Fetch devices with the highest favCounts within the date range
    const topDevices = await DevicesData.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .sort({ favCount: -1 })
      .limit(10)
      .select("deviceName _id brand favCount");

    res.status(200).json(topDevices);
  } catch (error) {
    console.error("Error getting top devices by favCount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.filterDevices = async (req, res) => {
  try {
    const { brand, battery, ram, storage, minPrice, maxPrice } = req.body;
    const filterCriteria = {};

    let filteredDevices;

    const allDevices = await DevicesData.find(
      {},
      "deviceName ram storage banner_img battery _id brand data"
    );
    filteredDevices = allDevices.filter((device) => {
      const matchesBrand =
        !brand || device.brand.match(new RegExp(`^${brand}$`, "i"));
      const matchesRam = !ram || new RegExp(`^${ram}$`, "i").test(device.ram);

      // Extracting storage values from the device's storage string
      const deviceStorageValues = device.storage
        .split("/")
        .map((value) => value.trim().toLowerCase());

      // Check if any of the requested storage values are present in the device's storage
      const matchesStorage =
        !storage ||
        deviceStorageValues.some((storageValue) =>
          storage.includes(storageValue)
        );

      // Extracting numerical part of the battery value
      const numericBatteryDevice =
        ((device.battery || "").match(/\d+/) || [])[0] || 0;
      const numericBatteryRequest =
        ((battery || "").match(/\d+/) || [])[0] || 0;
      const matchesBattery =
        !battery ||
        parseInt(numericBatteryDevice, 10) ===
        parseInt(numericBatteryRequest, 10);

      const priceObject = device.data.find((item) => item.type === "price");
      if (
        matchesBrand &&
        matchesRam &&
        matchesStorage &&
        matchesBattery &&
        priceObject &&
        priceObject.subType &&
        Array.isArray(priceObject.subType)
      ) {
        const priceDataObject = priceObject.subType.find((subItem) =>
          subItem.subData.includes("BDT")
        );
        if (priceDataObject) {
          const numericPrice = extractNumericPrice(priceDataObject.subData);
          return (
            numericPrice !== null &&
            numericPrice >= parseFloat(minPrice) &&
            numericPrice <= parseFloat(maxPrice)
          );
        }
      }
      return false;
    });

    const simplifiedDevices = filteredDevices.map((device) => ({
      deviceName: device.deviceName,
      banner_img: device.banner_img,
      _id: device._id,
      brand: device.brand,
    }));

    res.status(200).json(simplifiedDevices);
  } catch (error) {
    console.error("Error filtering devices:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.postComment = async (req, res) => {
  try {
    const { userEmail, userName, userImage, deviceId, text } = req.body;

    // Find or create the user by email
    const userEmailTrimmed = userEmail.trim().toLowerCase();
    let user = await UserModel.findOne({ email: userEmailTrimmed });

    // If the user does not exist, create a new user
    if (!user) {
      const newUser = new UserModel({
        displayName: userName,
        email: userEmailTrimmed,
        // Add other user details as needed (e.g., userImage)
      });

      user = await newUser.save();
    }

    // Create a new comment
    const comment = {
      userName: userName,
      userEmail: userEmail,
      userImage: userImage,
      comment: text,
    };

    // Save the comment to the device database
    await DevicesData.findByIdAndUpdate(
      deviceId,
      {
        $push: { comments: comment },
      },
      { new: true } // Ensure you get the updated document after the update
    );

    res.status(201).json({ message: 'Comment posted successfully' });
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.removeComment = async (req, res) => {
  try {
    const { deviceId, commentId } = req.params;
console.log("deviceId",deviceId,"commentId",commentId);
    // Find the comment by ID and remove it
    const result = await DevicesData.updateOne(
      { '_id': deviceId, 'comments._id': commentId },
      { $pull: { comments: { _id: commentId } } }
    );

    if (result.nModified > 0) {
      res.status(200).json({ message: 'Comment deleted successfully' });
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  } catch (error) {
    console.error('Error removing comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};