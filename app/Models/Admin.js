'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Admin extends Model {
           
    static get hidden () {
        return ['verify_code', 'admin_code', 'role', 'password', '2_steps_security', 'ban']
    }

    messageReply() {
        return this.hasMany('App/Models/MessageReply')
    }
}

module.exports = Admin
