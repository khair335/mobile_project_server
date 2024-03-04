const DevicesData = require("../models/deviceData"); // Import your Mongoose model
const UserModel = require("../models/userModel"); // Import your Mongoose model

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

    // Fetch all devices
    const allDevices = await DevicesData.find(
      {},
      "deviceName banner_img _id brand data"
    );

    // Filter devices based on the priceParam
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
          return numericPrice !== null && numericPrice <= priceParam;
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

// exports.updateFavCount = async (req, res) => {
//   const { deviceId } = req.params;

//   try {
//     const device = await DevicesData.findById(deviceId);

//     if (!device) {
//       return res.status(404).json({ error: "Device not found" });
//     }

//     device.favCount += 1;
//     await device.save(); // Change from favCount.save() to device.save()

//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Error updating favCount count:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };





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

    // Increment favCount
    device.favCount += 1;
    await device.save();

    // Update user's favorite devices
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the device is not already in the user's favorites
    if (!user.favorites.includes(deviceId)) {
      user.favorites.push(deviceId);
      await user.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating favCount and user favorites:", error);
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
