// routes/devicesData.js
const express = require('express');
const { requireSignin, adminMiddleware } = require('../commom-middleware');
const { createBrandName } = require('../controller/brandName');
const { getDeviceById } = require('../controller/deviceData');



const router = express.Router();

// POST endpoint for creating device data
router.post('/devicesData', requireSignin, adminMiddleware, createBrandName);

// GET endpoint for retrieving device data
router.get('/devicesData/:id', getDeviceById);

module.exports = router;
