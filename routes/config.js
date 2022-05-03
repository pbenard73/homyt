var express = require("express");
const fs = require('fs');
const path = require('path');
const mpdManager = require("../managers/mpd");
const socketManager = require("../socket");
var router = express.Router();
const acl = require("../src/middlewares/acl");

router.get("/", acl('ADMIN'), (req, res, next) => {
  const servers = require('./../data/server.json');

  res.json({servers});
});

router.post("/server", acl('ADMIN'), (req, res, next) => {
  const servers = require('./../data/server.json');

  const {host, port} = req.body;

  if (!host || !port) {
    return res.json({valid: false})
  }

  servers.push({host, port});

  fs.writeFileSync(path.join(__dirname, '/../data/server.json'), JSON.stringify(servers, null, 4))

  socketManager.emit('config_change');

  res.json({valid:true});
});

router.put("/setDefaultServer", acl('ADMIN'), async (req, res, next) => {
  let servers = require('./../data/server.json');
  const index = req.body.index;

  servers = servers.map((server, serverIndex) => {
    if (server.default === true && serverIndex !== index) {
      server.default = false
    }

    if (serverIndex === index) {
      server.default = true
    }

    return server
  })

  fs.writeFileSync(path.join(__dirname, '/../data/server.json'), JSON.stringify(servers, null, 4))

  await mpdManager.run(true);

  socketManager.emit('config_change');

  res.json({valid:true});
});


module.exports = router;
