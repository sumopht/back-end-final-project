// using express.js framework
const express = require("express");

const Controller = require("./Controller");

const router = express.Router();

// define endpoint for requests
router.get("/auth_app", Controller.authApp);
router.get("/access_token", Controller.accessToken);

// -----------------------------

module.exports = router;