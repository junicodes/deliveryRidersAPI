'use strict'
const { formatters } = use('Validator')

class RegCustomer {
  get rules () {
    return {
      // validation rules
      email_default: 'required|unique:customers,email_default',
      email_default: 'required|unique:customers,email_1',
      email_default: 'required|unique:customers,email_2',
      firstname: 'required|min:2',
      lastname: 'required|min:2',
      phone_default: 'required|unique:customers,phone_default',
      phone_default: 'required|unique:customers,phone_1',
      phone_default: 'required|unique:customers,phone_2',
      password: 'required|min:6'
    }
  }

  get messages() {
    return {
      'email_default.required': 'An email field is required to continue!',
      'email_default.unique': 'This email is already registered or associated to an account, please use another one!.',
      'firstname.required': 'The firstname field required!',
      'firstname.min': 'The firstname field requires at least 2 chracters!',
      'lastname.required': 'The lastname field required!',
      'lastname.min': 'The lastname field requires at least 2 chracters!',
      'phone_default.required': 'Phone numberfield required!',
      'phone_default.unique': 'This Phone is already registered, please use another one!.',
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
