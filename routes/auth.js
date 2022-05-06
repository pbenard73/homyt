var express = require("express");
const { Op } = require("sequelize");
const database = require("../database/db");
const socketManager = require("../socket");
const acl = require("../src/middlewares/acl");
var router = express.Router();
const userManager = require('./../managers/user')
const listener = require('./../utils/listener')

router.get("/", async (req, res, next) => {
  if (req.session.user) {
    return res.status(200).send()
  }

  if (req.query.token) {
    const user = await database.models.user.findOne({where: {token: req.query.token}});

    if (user) {
      return res.status(200).send()
    }
  }

  return res.status(403).send()
})

const createUserRouter = (install = false) => async (req, res, next) => {
  const {username: givenUsername, password, ...extra} = req.body

  if (!givenUsername || !password) {
    return res.json({valid: false})
  }

  const {id, username, settings, theme} = await userManager.createUser(givenUsername, password, {
    role: install === true ? 'ADMIN' : null,
    ...extra
  })

  if (install === true) {
    return next();
  }

  return res.json({valid: true, user: {id, username, settings, theme}})
}

const loginRoute = async (req, res) => {
  const { username, password } = req.body;

  const data = await userManager.login(req, username, password);

  return res.json(data)
}

router.post("/user/create", acl('ADMIN'), createUserRouter())

router.delete("/user/:id", acl('ADMIN'), async (req, res) => {
  if (req.params.id === req.session.user.id) {
    return res.json({valid: false})
  }

  await database.models.user.destroy({where: {id: req.params.id}});

  listener.trigger('USER_DELETE', parseInt(req.params.id));

  socketManager.emit('user_delete', parseInt(req.params.id));

  return res.json({valid: true})
})

router.put("/user/:id", acl('ADMIN'), async (req, res) => {
  const data = {...req.body, id: undefined}

  data.role = data.isAdmin === true ? 'ADMIN' : null;

  if ((data.password?.trim?.() || '') === '') {
    delete data.password;
  } else (
    data.password = userManager.encrypt(data.password)
  )

  const result = await database.models.user.update(data, {where: {id: req.params.id}})

  return res.json({valid: true})  
})

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

router.put("/settings", async (req, res) => {

  await database.models.user.update({settings: req.body}, {where: {id: req.session.user.id}});

  req.session.user.settings = req.body;

  return res.json({valid: true})
})

router.get('/users', acl('ADMIN'), async (req, res) => {
  const users = await database.models.user.findAll({raw: true, where: {id: {[Op.ne]: req.session.user.id}}, attributes: ['id', 'username', 'role', 'token']})

  res.json({valid: true, users})
})

module.exports = router;
