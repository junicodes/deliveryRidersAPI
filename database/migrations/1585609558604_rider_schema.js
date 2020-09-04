'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RiderSchema extends Schema {
  up () {
    this.create('riders', (table) => {
      table.increments()
      table.string('firstname').comment('Fistname name of the rider').notNullable()
      table.string('lastname').comment('Lastname name of the rider').notNullable()
      table.string('email', 254).comment('Official Email Account of the rider').notNullable().unique().index()
      table.string('phone').comment('Official Phone Number for Rider').notNullable().unique().index()
      table.string('rider_code').comment('custom code for the rider').notNullable().unique().index()
      table.string('address').comment('Address of the rider').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('active_vicinity').comment('This holds the array of business areas or vicinity rider operate at real time').nullable()
      table.string('photo').defaultTo('no_img.png')
      table.string('marked_position').comment('This is the last positon of the rider').nullable()
      table.string('password', 60).notNullable()
      table.boolean('ban').defaultTo(false)
      table.boolean('2_steps_security').defaultTo(false)
      table.string('verify_code', 60).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('riders')
  }
}

module.exports = RiderSchema
