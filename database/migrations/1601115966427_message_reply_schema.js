'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessageReplySchema extends Schema {
  up () {
    this.create('message_replys', (table) => {
      table.increments()
      table.integer('message_id').unsigned().nullable()
      table.integer('customer_id').unsigned().nullable()
      table.integer('rider_id').unsigned().nullable()
      table.integer('admin_id').unsigned().nullable()
      table.timestamps()

      table.foreign('message_id').references('messages.id')
      table.foreign('customer_id').references('customers.id')
      table.foreign('rider_id').references('riders.id')
      table.foreign('admin_id').references('admins.id')
    })
  }

  down () {
    this.drop('message_reply')
  }
}

module.exports = MessageReplySchema
