var express = require("express");
const database = require("../database/db");
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

const createUserRouter = (install = false) => async (req, res, next) => {
  const {username: givenUsername, password} = req.body

  if (!givenUsername || !password) {
    return res.json({valid: false})
  }

  const {id, username} = await userManager.createUser(givenUsername, password, install === true ? 'ADMIN' : null)

  if (install === true) {
    return next();
  }

  return res.json({valid: true, user: {id, username}})
}

const loginRoute = async (req, res) => {
  const { username, password } = req.body;

  const data = await userManager.login(req, username, password);

  return res.json(data)
}

router.post("/user/create", acl('ADMIN'), createUserRouter())

router.post(
  "/install",
  async (req, res, next) => {
    const userCount = await database.models.user.count();

    if (userCount > 0) {
      return res.status(403).json({valid: false})
    }

    return next()
  },
  createUserRouter(true),
  loginRoute
)

router.post("/login", loginRoute)

router.get("/logout", async (req, res) => {
  await req.session.destroy()

  return res.json({valid: true})
})

router.get("/refresh", async (req, res) => {
  const userCount = await database.models.user.count();

  return res.json({valid: req.session.user !== undefined, user: {...req.session.user, password: undefined}, install: userCount === 0})
})

module.exports = router;
