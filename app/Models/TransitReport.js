'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TransitReport extends Model {
           
    static get hidden () {
        return []
    }
    currentOrder () {
        return this.belongsTo('App/Models/CurrentOrder')
    }
}

module.exports = TransitReport
