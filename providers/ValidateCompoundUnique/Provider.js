'use strict'

const { ServiceProvider } = require('@adonisjs/fold')


class ValidateExists extends ServiceProvider {
  async _uniqueFn (data, field, message, args, get) {
    const Database = use('Database')
    let ignoreId = null
    let value = await get(data, field) // Get the value

    const table = args[0] //The Database table to check
    const fields = args[1].split('/') //The row column of this table
    if (args[2]) {
      ignoreId = args[2] //The Id of the User so as to exclude him
    }

    for (const column of fields) { //fields are array iof database colunm
        let rows = null;
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