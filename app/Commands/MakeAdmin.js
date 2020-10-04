'use strict'


const { Command } = require('@adonisjs/ace')
const AuthCotroller = use('App/Controllers/Http/Admin/AuthController')

class MakeAdmin extends Command {
  static get signature () {
    return 'make:admin'
  }

  static get description () {
    return 'Make An Admin Login Details For This Application'
  }

  async handle (args, options) {
    const adminAuth = new AuthCotroller
    const response = await adminAuth.makeAdminCommand()
    this.info(JSON.stringify(response))
  }
}

module.exports = MakeAdmin
