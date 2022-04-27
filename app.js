const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const mpdRouter = require("./routes/mpd");
const mpdManager = require('./managers/mpd')

const app = express();

mpdManager.run();

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
app.use("/mpd", mpdRouter);

module.exports = app;
