'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up() {
    this.create('products', (table) => {
      table.increments()
      table.integer('customer_id').unsigned()
      table.string('title').comment('This is a title identify the ame of the project')
      table.text('weight').comment('This identify the nearest weight of the product')
      table.text('description').comment('This is the more descriptive informtaion of the product')
      table.timestamps()

      table.foreign('customer_id')
        .reference('customer.id')
        .onDelete('cascade')

    })
  }

  down() {
    this.drop('products')
  }
}

module.exports = ProductSchema
