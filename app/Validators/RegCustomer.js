'use strict'
const { formatters } = use('Validator')

class RegCustomer {
  get rules () {
    return {
      // validation rules
      email_default: 'required|unique:customers,email_default',
      firstname: 'required|min:3|unique:customers,firstname',
      lastname: 'required|min:3|unique:customers,lastname',
      password: 'required|min:6'
    }
  }

  get messages() {
    return {
      'email_default.required': 'An email field is required to continue!',
      'email_default.unique': 'This email is already registered, please use another one!.',
      'firstname.required': 'The username field required!',
      'firstname.min': 'The username field requires at least 2 chracters!',
      'lastname.required': 'The username field required!',
      'lastname.min': 'The username field requires at least 2 chracters!',
      'password.required': 'The password field is required!',
      'password.min': 'The password field must be greater than 6 character!'
    }
  }
  
  async fails(errorMessages) {
    return this.ctx.response.status(422).json({
       message: errorMessages[0].message
    });
  }
  
}

module.exports = RegCustomer
