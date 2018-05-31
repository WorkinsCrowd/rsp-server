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
    let response = {
      status: 0
    }

    if (void 0 === message.data) {
      return ApiController.apiError(`undefined request data`)
    }

    if (!ApiController.validAddress(message.data)) {
      return ApiController.apiError(`wrong address`)
    }

    switch (command) {
      case 'ping':
        response.message = await this.db.ping(message.data.address)
        break
      case 'disconnect':
        response.message = await this.db.deleteConnection(message.data.address)
        break
      case 'checkAddress':
        response.message = await this.db.addressConnected(message.data.address)
        break
      default:
        response = ApiController.apiError(`Unknown command: ${command}`)
    }

    return response
  }

  static validAddress (data) {
    return typeof data.address === 'string' && data.address.length === 34
  }
}

module.exports = ApiController
