'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RiderSchema extends Schema {
  up () {
    this.create('riders', (table) => {
      table.increments()
      table.string('firstname').comment('Fistname name of the rider').notNullable()
      table.string('lastname').comment('Lastname name of the rider').notNullable()
      table.string('email_default', 254).comment('First email of the rider, uses the default email as alternative').notNullable().unique().index()
      table.string('email_1', 254).comment('Second email of the rider, uses the default email as alternative').notNullable().unique().index()
      table.string('email_2', 254).comment('Password email of the rider').notNullable().unique().index()
      table.string('phone_default').comment('First mobile phone of the rider').notNullable().unique().index()
      table.string('phone_1').comment('Second mobile phone of the rider').nullable()
      table.string('phone_2').comment('Third mobile phone of the rider').nullable()
      table.string('rider_code').comment('custom code for the rider').notNullable().unique().index()
      table.string('address').comment('Address of the rider').nullable()
      table.string('city').nullable().comment('This holds the state of the rider where he does more of his delivery').nullable()
      table.string('state').nullable().comment('This holds the state of the rider where he does more of his delivery').nullable()
      table.string('business_state').comment('This holds the array of business states rider operate at real time').nullable()
      table.string('image').defaultTo('no_img.png')
      table.string('marked_position').comment('This is the last positon of the rider').nullable()
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
    this.drop('riders')
  }
}

module.exports = RiderSchema
