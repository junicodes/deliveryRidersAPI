'use strict'
const {formatters} = use('Validator')

class CurrentOrder {
  get rules () {
    return {
      // validation rules
      rider_code: 'string',
      title:'required|string',
      expectation_date: 'required',
      receiver_name: 'required|string',
      receiver_phone: 'required|string',
      pick_up_address: 'required|string',
      delivery_address: 'required|string',
      total_weight: 'string',
      total_quatity: 'string',
      order_type: 'required:|string',
      receiver_photo: 'required|file|file_ext:png,jpg,jpeg|file_size:10mb|file_types:image',
      'product_photo.*': 'required|file|file_ext:png,jpg,jpeg|file_size:10mb|file_types:image'
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).json({
       message: errorMessages[0].message
    });
  }
}

module.exports = CurrentOrder
