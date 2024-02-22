// routes/devicesData.js
const express = require('express');
const { requireSignin, adminMiddleware } = require('../commom-middleware');
const { createBrandName } = require('../controller/brandName');
const { getDeviceById, createDevice, getAllDevices, updateDeviceById, getAllDevicesName } = require('../controller/deviceData');



const router = express.Router();

// POST endpoint for creating device data
router.post('/devicesData', requireSignin, adminMiddleware, createDevice);

// GET endpoint for retrieving device data
router.get('/devicesData/:id', updateDeviceById);
router.get('/devicesData', getAllDevices);
router.get('/allDeviceName', getAllDevicesName);
// PUT endpoint for updating device data
router.put('/devicesData/:id', requireSignin, adminMiddleware, updateDeviceById);
module.exports = router;
