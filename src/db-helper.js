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
  async addressConnected (address) {
    return (await this.connections.findOne({
      address
    })) !== null
  }

  async ping (address) {
    try {
      const currentEntry = await this.connections.findOne({
        address
      })

      if (currentEntry !== null) {
        await this.connections.updateOne({
          address
        }, {
          $set: {
            address,
            timestamp: Date.now()
          }
        })
      } else {
        await this.connections.insertOne({
          address,
          timestamp: Date.now()
        })
      }
    } catch (e) {
      console.error(e.message)
      return false
    }

    return true
  }

  async deleteConnection (address) {
    return (await this.connections.removeOne({ address }) && true) || false
  }

  close () {
    return this.client.close()
  }
}

module.exports = DbHelper
