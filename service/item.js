const Item = require('../models/item')

/**
* CRUD operation on items
* @module service/item
* @author Han Wang
* @param int item id
* @param  object data
* @return Mogoose model
*/
module.exports = {
  findOne(_id) {
    return Item.findOne({ _id }).populate('createUser')
  },
  add(data) {
    return Item.create(data)
  },
  update(_id, data) {
    return Item.findByIdAndUpdate(_id, data)
  },
  remove(_id) {
    return Item.remove({ _id })
  },
  findAll(query = {}) {
    const params = { status: 0 }
    if (query.type && query.type.length > 0) {
      params.type = { $in: query.type }
    }
    if (query.tags && query.tags.length > 0) {
      params.tags = { $in: query.tags }
    }
    if (query.name) {
      params.name = new RegExp(query.name)
    }
    if (query.createUser) {
      params.createUser = query.createUser
    }
    if (query.status === 'all') {
      delete params.status
    }
    return Item.find(params)
      .populate('createUser')
      .sort({ createdAt: -1 })
  }
}
