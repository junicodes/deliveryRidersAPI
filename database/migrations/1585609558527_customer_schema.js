'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CustomerSchema extends Schema {
  up () {
    this.create('customers', (table) => {
      table.increments()
      table.string('name').comment('This is legal name of the customer')
      table.string('auth_permit').comment('This is the authentication type [phone, email] of the customer')
      table.string('phone').comment('This is mobile phone of the customer')
      table.string('username').comment('This is the app username of the customer')
      table.string('email').comment('This is the email of the customer')
      table.text('bio').comment('This is simple bio details of the customer')
      table.enu('two_factor', ['no', 'yes']).comment('This is check if the login is secure by the system')
      table.timestamps()
    })
  }

  down () {
    this.drop('customers')
  }
}

module.exports = CustomerSchema
