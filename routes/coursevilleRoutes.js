// USING EXPRESS.JS FRAMWORK
const express = require("express");
const coursevilleController = require("../controller/coursevilleController");

const router = express.Router();

// DEFINE ENDPOINTS FOR REQUESTS
router.get("/auth_app", coursevilleController.authApp);
router.get("/access_token", coursevilleController.accessToken);

// --------------------------------------------------

module.exports = router;
