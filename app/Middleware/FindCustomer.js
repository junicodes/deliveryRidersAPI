'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Customer = use('App/Models/Customer')

class FindCustomer {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, auth}, next) {
    // call next to advance the request
    
    const customer = auth.user
    // console.log(customer)

    if(!customer){
      return response.status(401).json({ 
        mesage: "Customer not found!",
        id
      })
    }
    // Object.assign(request.all(), customer.toJSON())
    await next()
  }
}

module.exports = FindCustomer
