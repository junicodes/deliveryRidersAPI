'use strict'
const { formatters } = use('Validator')

class Register {
  get rules () {
    return {
      // validation rules
      email_default: `required|string|uniqueCompound:customers,email_default/email_1/email_2`,
      phone_default: `required|string|uniqueCompound:customers,phone_default/phone_1/phone_2`,
      firstname: 'required|min:2',
      lastname: 'required|min:2',
      password: 'required|min:6'
    }
  }

  get messages() {
    return {
      'email_default.required': 'An email field is required to continue!',
      'email_default.uniqueCompound': 'This email is already registered or associated to an account, please use another one!.',
      'firstname.required': 'The firstname field required!',
      'firstname.min': 'The firstname field requires at least 2 chracters!',
      'lastname.required': 'The lastname field required!',
      'lastname.min': 'The lastname field requires at least 2 chracters!',
      'phone_default.required': 'Phone numberfield required!',
      'phone_default.uniqueCompound': 'This Phone is already registered, please use another one!',
      'password.required': 'The password field is required!',
      'password.min': 'The password field must be greater than 6 character!'
    }
  }
  
  async fails(errorMessages) {
    let status = 422;
    let hint = 'Validaion needed';

    if(errorMessages[0].message.includes('getaddrinfo ENOTFOUND')) {
      status = 500;
      hint = 'This might be a poor internet connection.'
    }

    return this.ctx.response.status(status).json({
       message: errorMessages[0].message,
       hint
    });
  }
  
}

module.exports = Register
