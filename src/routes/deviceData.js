// routes/devicesData.js
const express = require('express');
const { requireSignin, adminMiddleware } = require('../commom-middleware');
const { createBrandName } = require('../controller/brandName');
const { getDeviceById, createDevice, getAllDevices } = require('../controller/deviceData');



const router = express.Router();

// POST endpoint for creating device data
router.post('/devicesData', requireSignin, adminMiddleware, createDevice);

// GET endpoint for retrieving device data
router.get('/devicesData/:id', getDeviceById);
router.get('/devicesData', getAllDevices);

module.exports = router;
