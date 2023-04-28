const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const Route = require("./Route");

const app = express();

const sessionOptions = {
    secret: "my-secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
    },
};

app.use(session(sessionOptions));

app.use("/", Route);

module.exports = app;