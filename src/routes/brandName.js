const express = require("express");
const { createBrandName, getBrandName, updateBrandName, deleteBrandName, getBrandNameById, getBrandByName } = require('../controller/brandName');
const { requireSignin, adminMiddleware } = require('../commom-middleware');

const router = express.Router();


router.post("/brandName", requireSignin, adminMiddleware, createBrandName);
router.get('/brandName',  getBrandName);
router.put('/brandName/:id',  updateBrandName);
router.delete('/brandName/:id', deleteBrandName);

router.get('/brandName/:name', getBrandByName);

module.exports = router;