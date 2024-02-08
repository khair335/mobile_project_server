const express = require("express");
const { requireSignin, adminMiddleware } = require("../commom-middleware");
const { createProducts, getProductsBySlug } = require("../controller/product");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/product");
const shortid = require("shortid");

const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post(
  "/product/cerate",
  requireSignin,
  adminMiddleware,
  upload.array("productPicture"),
  createProducts
);
router.get("/products/:slug", getProductsBySlug);
module.exports = router;
