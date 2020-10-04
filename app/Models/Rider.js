'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Rider extends Model {

    // static boot() {
    //     super.boot();
    //     this.addGlobalScope(builder => builder.with('currentOrder'));
    // }

    static get hidden () {
        return ['password', 'verify_code', '2_steps_security', 'ban']
    }
    currentOrder () {
        return this.hasMany('App/Models/CurrentOrder', 'rider_code', 'rider_code')
    }

    messageReply() {
        return this.hasMany('App/Models/MessageReply')
    }
}

module.exports = Rider
