'use strict'

const { formattters } = use('Validator')

class LogCustomer {
  get rules () {
    return {
      // validation rules
      auth_permit: 'min:3',
      username: 'min:3',
      password: 'required'
    }
  }

  get messages () {
    return {
      'auth_permit.min': 'The registration field [email, phone] should be greater than 3.',
      'username.min': 'The username field should be greater than 3.',
      'password.required': 'The password field is required'
    }
  }

  async fails (errorMessages){
    return this.ctx.response.status(422).json({
      message: errorMessages[0].message
    })
  }

}

module.exports = LogCustomer
