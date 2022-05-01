var express = require("express");
var router = express.Router();
const mpdManager = require("../managers/mpd");
const acl = require("../src/middlewares/acl");

Object.values(mpdManager.COMMANDS).forEach(command => {
  router.put(`/${command}`, acl('ADMIN'),  async (req, res) => {
    try {
      const data = await mpdManager[command](req)
      res.send({valid: true, data})
    } catch (e) {
      res.json({valid: false})
    }
  })
})

module.exports = router;
