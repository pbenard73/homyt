var express = require("express");
const database = require("../database/db");
var router = express.Router();

router.put("/", async (req, res, next) => {
  const {theme} = req.body;

  database.models.user.update({ theme }, {where: {id: req.session.user.id}})

  req.session.user.theme = theme;

  return res.json({valid: true})
})


module.exports = router;
