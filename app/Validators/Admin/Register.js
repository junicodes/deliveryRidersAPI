'use strict'

class AdminRegister {
  get rules () {
    return {
      // validation rules
      email: `required|string|unique:riders,email`,
      password: `required`,
      firstname: 'required|min:2',
      lastname: 'required|min:2',
      role: 'required'
    }
  }

  get messages() {
    return {
      'email.required': 'An email field is required to continue!',
      'email.unique': 'This email is already registered for an existing rider!.',
      'firstname.required': 'The firstname field required!',
      'firstname.min': 'The firstname field requires at least 2 chracters!',
      'lastname.required': 'The lastname field required!',
      'lastname.min': 'The lastname field requires at least 2 chracters!',
      'role.required': 'Admin role required!'
    }
  }
  
  async fails(errorMessages) {
    return this.ctx.response.status(422).json({
       message: errorMessages[0].message
    });
  }
}

module.exports = AdminRegister
