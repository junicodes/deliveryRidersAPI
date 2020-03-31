'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSchema extends Schema {
  up () {
    this.create('orders', (table) => {
      table.increments()
      table.integer('customer_id').unsigned().comment('This is a foreign key id that refers a customer table')
      table.integer('product_id').unsigned().comment('This is the product id that refers a product table')
      table.integer('rider_id').unsigned().comment('This is the delivery rider id that refers the rider table')
      table.string('order_no').comment('This is the order tracking id')
      table.string('to_name').comment('This is the client that receives the product')
      table.string('to_address').comment('This is the address of the client that receive the product')
      table.string('to_phone').comment('This is the phone of the client that receive the product')
      table.datetime('arrival_date').comment('This is the arrival date of the product to the client')

      table.foreign('customer_id')
      .reference('customer.id')
      .onDelete('cascade')

      table.foreign('product_id')
      .reference('product.id')
      .onDelete('cascade')

      table.foreign('rider_id')
      .reference('rider.id')
      .onDelete('cascade')

      table.timestamps()
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrderSchema
