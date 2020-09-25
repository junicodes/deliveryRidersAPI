'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Customer extends Model {
    
    static get hidden () {
        return ['password', 'verify_code', '2_steps_security', 
        'ban','email_permit_1', 'email_permit_2', 'account_verified_at']
    }

    currentOrder () {
        return this.hasMany('App/Models/CurrentOrder')
    }
}

module.exports = Customer
