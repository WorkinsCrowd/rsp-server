'use strict'
const config = require('./config')
const DbHelper = require('./src/db-helper')
const ApiController = require('./src/api-controller')

const main = async () => {
  const dbHelper = new DbHelper(config.database)
  await dbHelper.initialize()

  const api = new ApiController(config.server, dbHelper)
  const interval = setInterval(() => {
    dbHelper.clearOld()
  }, 10 * 1000)
}

main()
