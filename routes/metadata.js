const fs = require('fs')
const path = require('path')
const NodeID3 = require('node-id3')
const express = require("express");
const mpdManager = require('../managers/mpd');
const acl = require("../src/middlewares/acl");

const router = express.Router();

router.get('/', async (req, res) => {
  const givenFilePath = req.query.file;

  const filePath = path.join(process.env.MUSIC_FOLDER, givenFilePath)

  if (fs.existsSync(filePath) === false) {
    return res.json({valid: false});
  }

  const tags = NodeID3.read(filePath)

  res.json({valid: true, tags})
})

router.put('/', acl('ADMIN'), async (req, res) => {
  const {file: givenFilePath, tags} = req.body;
  
  const filePath = path.join(process.env.MUSIC_FOLDER, givenFilePath)

  if (fs.existsSync(filePath) === false) {
    return res.json({valid: false});
  }

  const valid = NodeID3.update(tags, filePath) //  Returns true/Error

  if (valid === true) {
    mpdManager.update()
  }
  
  res.json({valid})
})

module.exports = router;
