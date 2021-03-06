const prefix = '/api/v1'
const router = require('koa-router')({ prefix })
const userService = require('../service/user')
const authenticate = require('../strategies/auth')
const Joi = require('joi')
const Jwt = require('jsonwebtoken')
const CanUser = require('../permissions/users')
/**
* A user router module
* @module routers/item
* @author Han Wang
*/

/**
* handle login data and authenticate
* @param {object} ctx - The Koa request/response context object
* @param {function authenticate(params) {
  
}} 
* @throws {ValidationError} error 400
*/
router
  .post('/login', authenticate, async ctx => {
    const { _id, username, email } = ctx.state.user._doc
    const links = {
      self: `${ctx.protocol}://${ctx.host}${ctx.state.user._doc.avatarURL}`
    }
    const token = Jwt.sign(ctx.state.user._doc, 'token', { expiresIn: '1d' })
    ctx.session.token = token
    ctx.session.user = ctx.state.user
    ctx.body = { _id, username, email, token, links }
  })
  .post('/users', async ctx => {
    const schema = Joi.object({
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
      email: Joi.string().email(),
      avatarURL: Joi.string()
    })
    const { error, value } = schema.validate(ctx.request.body)
    if (error) {
      ctx.throw(400, error)
    }
    /**
* check the username
* @param {string} username 
* @param {string} valueusernmae
* @throws {ValidationError} error 400
*/
    let isExist = await userService.find('username', value.username)
    if (isExist) {
      ctx.status = 400
      ctx.throw(400, 'the username already exists')
    }
    let user = await userService.add(value)
    ctx.status = 201
    ctx.body = {
      _id: user._id,
      ...user._doc,
      password: undefined,
      passwordSalt: undefined,
      links: {
        self: `${ctx.protocol}://${ctx.host}${user._doc.avatarURL}`
      }
    }
  })
  /**
   * get userinfo
   */
  .get('/user/:id', async ctx => {
    if (!CanUser.read(ctx.session.user, { _id: ctx.params.id }).granted) {
      ctx.throw(403, '')
      return
    }
    const _id = ctx.params.id
    let user = await userService.find({
      _id
    })
    if (!user) {
      ctx.status = 404
      ctx.body = { message: 'fail to get user information' }
    }
    ctx.body = {
      ...user._doc,
      links: {
        self: `${ctx.protocol}://${ctx.host}${user._doc.avatarURL}`
      },
      password: undefined,
      passwordSalt: undefined
    }
  })
  /**
   * update userinfo
   */
  .put('/user/:id', async ctx => {
    if (!CanUser.read(ctx.session.user, { _id: ctx.params.id }).granted) {
      ctx.throw(403, '')
      return
    }
    const _id = ctx.params.id
    const user = ctx.request.body
    await userService.update(_id, user)
    ctx.body = {
      message: 'success'
    }
  })
module.exports = router
