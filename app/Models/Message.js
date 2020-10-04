'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Message extends Model {
    
    static get hidden () {
        return []
    }

    messageReply () {
        return this.hasMany('App/Models/MessageReply')
    }
}

module.exports = Message
