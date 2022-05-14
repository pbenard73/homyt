const fs = require('fs')
const path = require('path')
const https = require('https')
var express = require("express");
const coverManager = require('../managers/cover');
var router = express.Router();

const UNKNOW_PICTURE = path.join(__dirname, '/../public/unknow_album.png')
const TRANSPARENT_PIXEL = path.join(__dirname, '/../public/transparent_pixel.png')

const download = (url, dest) => new Promise((resolve, reject) => {
  var file = fs.createWriteStream(dest);
  https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(resolve);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlinkSync(dest); // Delete the file async. (But we don't check the result)
    reject()
  });
});

router.get("/", async (req, res, next) => {
  try {
    let {query, path:givenPath, radio, big} = req.query;

    const isRadio = [true, 'true'].indexOf(radio) !== -1;
    const isBig = [true, 'true'].indexOf(big) !== -1;

    if (!query || !path) {
      return res.sendFile(isBig ? TRANSPARENT_PIXEL : UNKNOW_PICTURE)
    }


    let safe_path = path.basename(givenPath)
    safe_path = safe_path.replace(/\//g, '_');
    const filePath = path.join(__dirname, '/../uploads/cover/', safe_path)
    
    if (fs.existsSync(filePath) === true) {
      return res.sendFile(filePath)
    }

    const data = await coverManager.search(query, isBig)

    if (Array.isArray(data) === false || data.length === 0) {
      return res.sendFile(UNKNOW_PICTURE)
    }
    
    if (isRadio === true) {
      return res.redirect(data[0])
    }

    await download(data[0], filePath)
    return res.sendFile(filePath)
  } catch(e) {
    console.log(e)
    return res.sendFile(UNKNOW_PICTURE)
  }
})

router.post("/searchAlbum", async (req, res, next) => {
  const {album} = req.body;

  let data = await coverManager.search(album)

  return res.json({valid: true, data})
})


module.exports = router;
