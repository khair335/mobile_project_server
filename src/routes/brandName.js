const express = require("express");
const { createBrandName, getBrandName } = require('../controller/brandName');
const { requireSignin, adminMiddleware } = require('../commom-middleware');

const router = express.Router();


router.post("/brandName", requireSignin, adminMiddleware, createBrandName);
router.get('/brandName',  getBrandName);

module.exports = router;