// routes/devicesData.js
const express = require('express');
const { requireSignin, adminMiddleware } = require('../commom-middleware');
const { createBrandName } = require('../controller/brandName');
const { getDeviceById, createDevice, getAllDevices, updateDeviceById, getAllDevicesName, getBrandNameWiseData, getDevicesByPrice, getPricesByCondition, updateVisitorCount, getTopDevicesLast10Days, getTopDevicesByFavLast10Days, filterDevices } = require('../controller/deviceData');



const router = express.Router();

// POST endpoint for creating device data
router.post('/devicesData', requireSignin, adminMiddleware, createDevice);
router.post('/filterDevices', filterDevices);
// GET endpoint for retrieving device data
router.get('/devicesData/:id', updateDeviceById);
router.get('/devicesData', getAllDevices);
router.get('/allDeviceName', getAllDevicesName);
router.get('/brand/:brandName', getBrandNameWiseData);
router.get('/budget/:priceParam', getDevicesByPrice);
router.get('/getTopDevicesLast10Days', getTopDevicesLast10Days);
router.get('/getTopDevicesByFavLast10Days', getTopDevicesByFavLast10Days);
// PUT endpoint for updating device data
router.put('/devicesData/:id', requireSignin, adminMiddleware, updateDeviceById);
router.put('/updateVisitorCount/:deviceId', updateVisitorCount);
module.exports = router;
