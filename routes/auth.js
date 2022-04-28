var express = require("express");
const acl = require("../src/middlewares/acl");
var router = express.Router();
const userManager = require('./../managers/user')

router.get("/", async (req, res, next) => {
  console.log(req.session);

  if (req.session.user) {
    return res.status(200).send()
  }

  return res.status(403).send()
})

router.post("/user/create", acl('ADMIN'), async (req, res, next) => {
  const {username: givenUsername, password} = req.body

  if (!givenUsername || !password) {
    return res.json({valid: false})
  }

  const {id, username} = await userManager.createUser(givenUsername, password)

  return res.json({valid: true, user: {id, username}})
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const data = await userManager.login(req, username, password);

  return res.json(data)
})

router.get("/logout", async (req, res) => {
  await req.session.destroy()

  return res.json({valid: true})
})

router.get("/refresh", async (req, res) => {
  return res.json({valid: req.session.user !== undefined, user: {...req.session.user, password: undefined}})
})

module.exports = router;
