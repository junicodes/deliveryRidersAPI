'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CustomerSchema extends Schema {
  up () {
    this.create('customers', (table) => {
      table.increments()
      table.string('firstname').comment('Legal fistname name of the customer').notNullable()
      table.string('lastname').comment('Legal lastname name of the customer').notNullable()
      table.string('email_default', 254).comment('First email of the customer, uses the default email as alternative').notNullable().unique().index()
      table.string('email_1', 254).comment('Second email of the customer, uses the default email as alternative').notNullable().unique().index()
      table.string('email_2', 254).comment('Password email of the customer').notNullable().unique().index()
      table.string('phone_default').comment('first mobile phone of the customer').notNullable().unique().index()
      table.string('phone_1').comment('This is second mobile phone of the customer').nullable()
      table.string('phone_2').comment('This is third mobile phone of the customer').nullable()
      table.string('photo').defaultTo('cherishsoft-delivery-riders/default/no_img.png')
      table.string('address').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('password', 60).notNullable()
      table.boolean('ban').defaultTo(false)
      table.boolean('2_steps_security').defaultTo(false)
      table.boolean('email_permit_1').defaultTo(false).comment('set permission for the first associated email login access')
      table.boolean('email_permit_2').defaultTo(false).comment('set permission for the second associated email login access')
      table.string('verify_code', 60).notNullable().unique()
      table.datetime('account_verified_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('customers')
  }
}

module.exports = CustomerSchema
