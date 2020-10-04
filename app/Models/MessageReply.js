'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MessageReply extends Model {
       
    static get hidden () {
        return []
    }

    message () {
        return this.belongsTo('App/Models/Message')
    }

    customer () {
        return this.belongsTo('App/Models/Customer')
    }

    rider() {
        return this.belongsTo('App/Models/Rider')
    }

    admin() {
        return this.belongsTo('App/Models/Admin')
    }
}

module.exports = MessageReply
