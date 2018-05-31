'use strict'
const micro = require('micro')

class ApiController {
  constructor (config, dbHelper) {
    this.server = micro(this.requestHandler.bind(this))
    this.server.listen(config.port)
    console.log('Listening at', config.port)
    this.db = dbHelper
  }

  async requestHandler (req) {
    try {
      const data = await micro.json(req)

      return await this.queryHandler(data)
    } catch (e) {
      console.error('Can\'t handle request.', e.message)
      return ApiController.apiError()
    }
  }

  static apiError (message) {
    return {
      status: -1,
      message
    }
  }

  async queryHandler (message) {
    const command = message.command
    let response = {}

    switch (command) {
      case '1':
        return 1

      default:
        response = ApiController.apiError(`Unknown command: ${command}`)
    }

    return response
  }
}

module.exports = ApiController
