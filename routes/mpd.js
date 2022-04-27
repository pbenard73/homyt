var express = require("express");
var router = express.Router();
const mpdManager = require("../managers/mpd");

Object.values(mpdManager.COMMANDS).forEach(command => {
  router.put(`/${command}`, async (req, res) => {
    const data = await mpdManager[command](req)
    res.send({valid: true, data})
  })
})

module.exports = router;
