'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class FindUser {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, auth}, next) {
    // call next to advance the request
    
    const user = auth.user

    if(!user){
      return response.status(401).json({ 
        mesage: "User not found!"
      })
    }
    await next()
  }
}

module.exports = FindUser
