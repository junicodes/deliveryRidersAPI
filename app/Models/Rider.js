'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Rider extends Model {

    static get hidden () {
        return ['password', 'verify_code', '2_steps_security', 'ban']
    }
}

module.exports = Rider
