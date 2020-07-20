'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CurrentOrderSchema extends Schema {
  up() {
    this.create('current_orders', (table) => {
      table.increments()
      table.integer('customer_id').unsigned()
      table.integer('rider_id').unsigned()
      table.string('title').comment('Project name').notNullable()
      table.string('order_id').comment('Unique identity for order').unique().index()
      table.string('acceptance_code').comment('Secret code the rider na the delivery issuer will know').notNullable()
      table.string('receiver_name').comment('Who is receiving this order').nullable()
      table.string('receiver_phone').comment('This order reciever phone').nullable()
      table.string('receiver_photo').comment('This is the photo of the receiver').defaultTo('no_img.png')
      table.string('pick_up_address').comment('Where product would be picked from')
      table.string('delivery_address').comment('Where product would be picked from')
      table.string('total_weight').comment('This identify the nearest weight of the product').nullable()
      table.string('total_quantity').comment('This identify the total quantity of product').nullable()
      table.string('order_type').comment('This is the order type base on pricing').nullable()
      table.string('order_price').comment('This is the estimated price for this order').nullable()
      table.json('product_photo').comment('This is the photo of product order')
      table.date('expectation_date').comment('The date to expect this delivery').notNullable()
      table.date('received_date').comment('The date the goods was received').nullable()
      table.enu('status', ['Processing', 'Delayed', 'Pending','Declined', 'Accepted']).comment('This is the estimated price for this order')
      table.text('description').comment('This is the more descriptive informtaion of the product').nullable()
      table.timestamps()

      table.foreign('customer_id').references('customers.id').onDelete('cascade')
      table.foreign('rider_id').references('riders.id').onDelete('cascade')
    })
  }

  down() {
    this.drop('current_orders')
  }
}

module.exports = CurrentOrderSchema
