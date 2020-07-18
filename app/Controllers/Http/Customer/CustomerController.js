'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Customer = use('App/Models/Customer')
const Database = use('Database')

class CustomerController {
  
  async index ({response, params: { page }}) {

    const customers = await Customer.query().paginate(page)

    response.status(200).json({
      message: "All customers",
      data: customers
    })
    
  }
 
  async store ({ request }) {
    
    const trx = await Database.beginTransaction()
    try {
     const customerInfo = await Customer.create(request.post())
      trx.commit()//once done commit the transaction
      return {message: 'Successfully created a new customer.', customer: customerInfo, status: 200}
    } catch (error) {

      await trx.rollback()
      return {message: 'An unexpected error occured when creating a customer.', hint: error.message, status:501}
    }

  }

  async show ({ request, response }) {

    const customer = request.post().customer
    response.status(200).json({message: "Customer found!", data: customer})

  }
 
  async update ({request, response }) {

      const {name, phone, username, email, customer} = request.post()
      const trx = await Database.beginTransaction();

      try {
        customer.name = name;
        customer.phone = phone;
        customer.username = username;
        customer.email = email;

        await customer.save(trx);
        trx.commit(); //once done commit the transaction
        response.status(201).json({message: 'Successfully updated customer.', data: customer});

      } catch (error) {

        await trx.rollback()
        response.status(501).json({message: 'An unexpected error occured when creating a customer.', hint:  error.message});
      }

  }

  async destroy ({request, response }) {

    const customer = request.post().customer;
      await customer.delete();
      response.status(200).json({message: "Customer account duccesfully delete!"});
  }
}

module.exports = CustomerController
