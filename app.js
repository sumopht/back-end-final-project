const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const AppError = require("./utils/appError");
const coursevilleRoutes = require("./routes/coursevilleRoutes");

const app = express();

const sessionOptions = {
  secret: "my-secret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
  },
};

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(express.static("static"));
app.use(cors(corsOptions));
app.use(session(sessionOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/courseville", coursevilleRoutes);

// REDIRECT TO LOG IN FIRST
app.get("/", (req, res) => {
  res.redirect(`http://${process.env.backendIPAddress}/courseville/auth_app`)
});

module.exports = app;
