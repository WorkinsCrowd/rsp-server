'use strict'
const MongoClient = require('mongodb').MongoClient

class DbHelper {
  constructor (config) {
    this.config = config
    this.db = null
  }

  async initialize () {
    let status = true

    try {
      this.client = await MongoClient.connect(this.config.url)
      this.db = this.client.db(this.config.name)
      this.connections = this.db.collection('connections')
    } catch (e) {
      console.error(e.message)
      status = false
    }

    return status
  }

  close () {
    return this.client.close()
  }
}

module.exports = DbHelper
