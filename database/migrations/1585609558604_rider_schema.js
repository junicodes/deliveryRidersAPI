'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RiderSchema extends Schema {
  up () {
    this.create('riders', (table) => {
      table.increments()
      table.string('firstname').comment('This is legal fistname name of the rider').notNullable()
      table.string('lastname').comment('This is legal lastname name of the rider').notNullable()
      table.string('email_default', 254).comment('This is the first email of the rider, uses the default email as alternative').notNullable().unique().index()
      table.string('email_1', 254).comment('This is the second email of the rider, uses the default email as alternative').notNullable().unique().index()
      table.string('email_2', 254).comment('This is the password email of the rider').notNullable().unique().index()
      table.string('phone_default').comment('This is first mobile phone of the rider').notNullable().unique().index()
      table.string('phone_1').comment('This is second mobile phone of the rider').nullable()
      table.string('phone_2').comment('This is third mobile phone of the rider').nullable()
      table.string('rider_code').comment('This is the username of the rider').notNullable().unique().index()
      table.string('address').comment('This is the address of the rider').nullable()
      table.string('city').nullable().comment('This holds the state of the rider where he does more of his delivery').nullable()
      table.string('state').nullable().comment('This holds the state of the rider where he does more of his delivery').nullable()
      table.string('business_state').comment('This holds the array of business states rider operate at real time').nullable()
      table.string('image').defaultTo('no_img.png')
      table.string('marked_position').comment('This is the last positon of the rider').nullable()
      table.string('password', 60).notNullable()
      table.boolean('ban').defaultTo(false)
      table.boolean('2_steps_security').defaultTo(false)
      table.string('verify_code', 60).notNullable().unique()
      table.timestamps().table.timestamps().defaultTo(this.fn.now())
    })
  }

  down () {
    this.drop('riders')
  }
}

module.exports = RiderSchema
