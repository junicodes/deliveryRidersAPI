'use strict'

class CustomerResetPassword {
  get rules () {
    return {
      // validation rules
      verify_code: 'required|min:6|max:6',
      password: 'required|min:6'
    }
  }

  get messages () {
    return {
      'verify_code.required': 'Please provide verify_code for sent to your mail',
      'verify_code.min': 'Please code must be 6 digit',
      'verify_code.max': 'Please code must be 6 digit',
      'password.min': 'Password field must be above 6.',
      'password.required': 'The password field is required.'
    }
  }

  async fails (errorMessages){
    return this.ctx.response.status(422).json({
      message: errorMessages[0].message
    })
  }
}

module.exports = CustomerResetPassword
