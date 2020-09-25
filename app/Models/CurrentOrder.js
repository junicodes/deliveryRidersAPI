'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CurrentOrder extends Model {

    // static get hidden () {
    //     return ['']
    // }

    customer () {
        return this.belongsTo('App/Models/Customer')
    }

    rider () {
        return this.belongsTo('App/Models/Rider', 'rider_code', 'rider_code') //Table //Foreign_key //column to comapre foreign_key with from other table
    }
}

module.exports = CurrentOrder
