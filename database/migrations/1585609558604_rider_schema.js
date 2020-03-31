'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RiderSchema extends Schema {
  up () {
    this.create('riders', (table) => {
      table.increments()
      table.string('name').comment('This is name of the rider')
      table.string('auth_permit').comment('This is the authentication type [phone, email, username] of the customer')
      table.string('username').comment('This is the username of the rider')
      table.string('phone_1').comment('This is the first phone number and also used for authentication of the rider')
      table.string('phone_2').comment('This is the secound phone number of the rider')
      table.string('email').comment('This is the email of the rider')
      table.string('business_state').comment('This holds the state of the rider where he does more of his delivery')
      table.string('marked_position').comment('This is the last positon of the rider')


      table.timestamps()
    })
  }

  down () {
    this.drop('riders')
  }
}

module.exports = RiderSchema
