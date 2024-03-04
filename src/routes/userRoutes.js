// userRoutes.js

const express = require('express');
const { saveUserInfo } = require('../controller/userController');
const router = express.Router();

router.post('/saveUserInfo', saveUserInfo);

module.exports = router;
