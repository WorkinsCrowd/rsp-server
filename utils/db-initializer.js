'use strict'
const MongoClient = require('mongodb').MongoClient
const config = require('../config')

MongoClient.connect(config.database.url).then(async (client) => {
  const db = client.db(config.database.name)
  const connections = db.collection('connections')

  try {
    await connections.createIndexes([{
      key: {
        address: 1
      }
    }])
  } catch (e) {
    console.error(e.message)
  }
})
