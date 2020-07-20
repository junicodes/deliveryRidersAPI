'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdminSchema extends Schema {
  up () {
    this.create('admins', (table) => {
      table.increments()
      table.string('firstname').comment('This is legal firstname name of the admin').notNullable()
      table.string('lastname').comment('This is legal lastname name of the admin').notNullable()
      table.string('email', 254).notNullable().unique().index()
      table.string('photo').defaultTo('no_img.png')
      table.string('admin_code').comment('This is the admin unique code for in house security').notNullable().unique().index()
      table.string('role').comment('This is identify what type of admin in the system, eg [sales,IT,super_admin,legal,customer_support]').nullable()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('admins')
  }
}

module.exports = AdminSchema
