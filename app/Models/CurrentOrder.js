'use strict'

const dayjs = use('dayjs')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CurrentOrder extends Model {

    static get hidden () {
        return ['receiver_photo_file_id', 'product_photo_file_ids', 'expectation_date', 'expectation_time']
    }

    static get computed () {
        return ['deliverydate']
    }

    getDeliverydate ({expectation_date, expectation_time}) {
        const expectDate = dayjs(expectation_date).format().toString().split('T');
        const expectTime = expectation_time.split('.')
        return `${expectDate[0]} ${expectTime[0]}`
    }

    customer () {
        return this.belongsTo('App/Models/Customer')
    }

    rider () {
        return this.belongsTo('App/Models/Rider', 'rider_code', 'rider_code') //Table //Foreign_key //column to comapre foreign_key with from other table
    }

    transitReport () {
        return this.hasMany('App/Models/TransitReport')
    }
}

module.exports = CurrentOrder
