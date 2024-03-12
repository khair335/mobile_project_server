// userRoutes.js

const express = require('express');
const { saveUserInfo, getUserFavoriteDevices, getUserFavoriteDeviceById } = require('../controller/userController');
const router = express.Router();

router.post('/saveUserInfo', saveUserInfo);
router.get("/users/:userEmail/favorite-devices", getUserFavoriteDevices);
router.get("/users/:userEmail/devices/:deviceId", getUserFavoriteDeviceById);
module.exports = router;
