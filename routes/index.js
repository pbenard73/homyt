var express = require("express");
var router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const downloader = require("./../downloader");
const exceptFiles = [".git", "node_modules"];

const loopFile = (rootPath) =>
  fs
    .readdirSync(rootPath, { withFileTypes: true })
    .filter((i) => i.isDirectory() === true && exceptFiles.indexOf(i.name) === -1)
    .map((i) => ({
      name: i.name,
      path: path.join(rootPath, i.name).replace(process.env.MUSIC_FOLDER, ""),
      children: loopFile(path.join(rootPath, i.name)),
    }));

router.get("/config", (req, res, next) => {
  const files = loopFile(process.env.MUSIC_FOLDER);

  res.json(files);
});

router.post("/download", async (req, res, next) => {
  const { url, folder } = req.body;
  console.log(process.env, path.join(process.env.MUSIC_FOLDER, folder));
  downloader.run(url, path.join(process.env.MUSIC_FOLDER, folder));

  res.json({ valid: true });
});

router.post("/search/:query", async (req, res, next) => {
  const { query } = req.params;

  try {
    const { data } = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(
        query
      )}&order=viewCount&type=video&key=${process.env.API_KEY}`
    );

    res.json(data);
  } catch (e) {
    console.log(e);
    res.status(500).json({});
  }
});

module.exports = router;
