'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UpdateUsersLevelOneSchema extends Schema {

  up () {
    this.alter('users', (table) => {
      //query add new field
      table.string('token').after('email');
   })
  }

}

module.exports = UpdateUsersLevelOneSchema
