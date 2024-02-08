const express = require("express");
var jwt = require("jsonwebtoken");
const multer = require("multer");
const Product = require("../models/product");
const shortid = require("shortid");
const path = require("path");

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  } else {
    return res.status(400).json({ message: "Authorization required" });
  }

  next();
};

exports.userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(400).json({ message: "User access denied" });
  }
  next();
};
exports.adminMiddleware = (req, res, next) => {
  //   const user = req.user.role;
  //   console.log(user);

  if (req.user.role !== "admin") {
    return res.status(400).json({ message: "Access denied" });
  }

  next();
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
exports.upload = multer({ storage });
