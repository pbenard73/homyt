const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const mpdRouter = require("./routes/mpd");
const themeRouter = require("./routes/theme");
const authRouter = require("./routes/auth");
const mpdManager = require('./managers/mpd');
const database = require('./database/db');
const session = require('express-session')
const dataManager = require('./managers/data')

dataManager.checkPresence()

const app = express();
app.set('trust proxy', 1)

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

mpdManager.run();
database.init();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.options("*", cors({ credentials: true, origin: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/mpd", mpdRouter);
app.use("/theme", themeRouter);

module.exports = app;
