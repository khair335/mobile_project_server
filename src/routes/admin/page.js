const express = require("express");
const {
  upload,
  requireSignin,
  adminMiddleware,
} = require("../../commom-middleware");

const { createPage } = require("../../controller/admin/page");

const router = express.Router();

router.post(
  "/page/create",
  requireSignin,
  adminMiddleware,
  upload.fields([
    {
      name: "banners",
    },
    { name: "products" },
  ]),
  createPage
);

module.exports = router;
