const User = require('../models/user')
const bcrypt = require('bcrypt')
/**
* CRUD operation on message
* @module service/item
* @author Han Wang
* @param {object} user user
* @return Mogoose model
*/

module.exports = {
  find(key, value) {
    return User.findOne({
      [key]: value
    })
  },
  add(user) {
    const password = user.password
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    user.password = hash
    user.passwordSalt = salt
    return User.create(user)
  },
  update(_id, user) {
    return User.findByIdAndUpdate(_id, user)
  }
}
