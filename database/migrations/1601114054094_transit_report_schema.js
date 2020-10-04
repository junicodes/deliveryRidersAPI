'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransitReportSchema extends Schema {
  up () {
    this.create('transit_reports', (table) => {
      table.increments()
      table.integer('current_order_id').unsigned()
      table.string('report').comment('Detailed report form rider or admin').notNullable()
      table.dateTime('report_time').comment('Datetime of the report').nullable()
      table.timestamps()

      table.foreign('current_order_id').references('current_orders.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('transit_reports')
  }
}

module.exports = TransitReportSchema
