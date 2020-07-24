'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class ValidateExists extends ServiceProvider {
  async _uniqueFn (data, field, message, args, get) {
    const Database = use('Database')
    let value = get(data, field) // Get the value

    let ignoreId = null
    const fields = args[1].split('/')
    const table = args[0]
    if (args[2]) {
      ignoreId = args[2]
    }
  
    for (const column of fields) {
        let rows;
        if(ignoreId){
           rows = await Database.table(table).where(column, value).whereNot('id', '=', ignoreId).first()
        }else {
           rows = await Database.table(table).where(column, value).first()
        }
        if (rows) {
          throw message
        }
    }
  }

  boot () {
    const Validator = use('Validator')

    Validator.extend('uniqueCompound', this._uniqueFn, 'Must be unique')

  }
}

module.exports = ValidateExists