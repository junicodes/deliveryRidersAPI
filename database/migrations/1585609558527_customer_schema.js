'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CustomerSchema extends Schema {
  up () {
    this.create('customers', (table) => {
      table.increments()
      table.string('firstname').comment('This is legal fistname name of the customer').notNullable()
      table.string('lastname').comment('This is legal lastname name of the customer').notNullable()
      table.string('email_default', 254).comment('This is the first email of the customer, uses the default email as alternative').notNullable().unique().index()
      table.string('email_1', 254).comment('This is the second email of the customer, uses the default email as alternative').notNullable().unique().index()
      table.string('email_2', 254).comment('This is the password email of the customer').notNullable().unique().index()
      table.string('phone_default').comment('This is first mobile phone of the customer').notNullable().unique().index()
      table.string('phone_1').comment('This is second mobile phone of the customer').nullable()
      table.string('phone_2').comment('This is third mobile phone of the customer').nullable()
      table.string('image').defaultTo('no_img.png')
      table.string('address').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.boolean('ban').defaultTo(false)
      table.boolean('2_steps_security').defaultTo(false)
      table.string('verify_code', 60).notNullable().unique()
      table.timestamps().defaultTo(this.fn.now())
    })
  }

  down () {
    this.drop('customers')
  }
}

module.exports = CustomerSchema
