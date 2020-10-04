'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class OnlySuperAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({response, auth}, next) {
    // call next to advance the request

    const user = auth.user

    if(user.role !== 'super_admin') {
      return response.status(403).json({
        message: "Permission denied for admin"
      })
    }
    await next()
  }
}

module.exports = OnlySuperAdmin
