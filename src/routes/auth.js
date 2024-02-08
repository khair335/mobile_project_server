const express = require("express");
const { signup, signin, requireSignin } = require("../controller/auth");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../validators/auth");

const router = express.Router();

router.post("/signin", validateSigninRequest, isRequestValidated, signin);
router.post("/signup", validateSignupRequest, isRequestValidated, signup);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({ user: "Profile" });
// });

module.exports = router;
