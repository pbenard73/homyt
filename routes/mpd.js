var express = require("express");
var router = express.Router();
const mpdManager = require("../managers/mpd");
const acl = require("../src/middlewares/acl");

Object.values(mpdManager.COMMANDS).forEach(command => {
  router.put(`/${command.label}`, acl('ADMIN'),  async (req, res) => {
    try {
      const data = await mpdManager[command.label](req)

      if (data?.valid === false) {
        return res.send(data);
      }
      
      res.send({valid: true, data})
    } catch (e) {
      console.log(e)
      res.json({valid: false})
    }
  })
})

module.exports = router;
