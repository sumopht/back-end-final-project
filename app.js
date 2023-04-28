const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const Route = require("./Route");

const app = express();

app.use("/", Route);

module.exports = app;