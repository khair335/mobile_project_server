// userController.js

const UserModel = require("../models/userModel");
const mongoose = require("mongoose");
exports.saveUserInfo = async (req, res) => {
    try {
        const { uid, displayName, email } = req.body;

        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) {
            const newUser = new UserModel({
                uid,
                displayName,
                email,
            });

            await newUser.save();

            res.status(201).json({ message: 'User information saved successfully.' });
        } else {
            res.status(409).json({ message: 'User already exists in the database.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserFavoriteDevices = async (req, res) => {
  try {
    const { userEmail } = req.params;
    console.log("userEmail",userEmail);
    // Find the user by email
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with the user's favorite devices list
    res.status(200).json({ favoriteDevices: user.favoriteDevices || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserFavoriteDeviceById = async (req, res) => {
  try {
    const { userEmail, deviceId } = req.params;
    console.log("userEmail", userEmail);
    console.log("deviceId", deviceId);

    // Find the user by email
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has the specified device in their favorites
    const favoriteDevice = user.favoriteDevices.find((favDevice) => favDevice._id.equals(mongoose.Types.ObjectId(deviceId)));

    if (!favoriteDevice) {
      return res.status(404).json({ error: "Device not found in user's favorites" });
    }

    // Respond with the device data
    const deviceData = {
      deviceId: favoriteDevice._id,
      deviceName: favoriteDevice.deviceName,
      banner_img: favoriteDevice.banner_img,
      // Add other properties you want to include
    };

    res.status(200).json({ device: deviceData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// exports.getUserFavoriteDeviceById = async (req, res) => {
//   try {
//     // Log deviceId
//     const { deviceId } = req.params;
//     console.log("deviceId", deviceId);

//     // Rest of your code remains the same...
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
