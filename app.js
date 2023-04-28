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

app.use("/home", Route);

// Redirect to log in first
app.get("/", (req, res) => {
    res.redirect(`http://${process.env.backendIPAddress}/home/auth_app`)
});

module.exports = app;