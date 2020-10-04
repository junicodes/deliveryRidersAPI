'use strict'

class AdminLogin {
  get rules () {
    return {
      // validation rules
      email: 'min:3',
      password: 'required'
    }
  }

  get messages () {
    return {
      'email.min': 'The email field should be greater than 3.',
      'password.required': 'The password field is required'
    }
  }

  async fails (errorMessages){
    return this.ctx.response.status(422).json({
      message: errorMessages[0].message
    })
  }
}

module.exports = AdminLogin
