'use strict'

class UpdateCustomer {
  get rules () {
   const { id } = this.ctx.params
    
    return {
      // validation rules
      name: 'required|min:5',
      email: `required|email|unique:customers,email,id,${id}`,
      phone: `required|unique:customers,phone,id,${id}`,
      username: `required|min:3|unique:customers,username,id,${id}`,

    }
  }

  get messages () {
    return {
      'name.required': 'Name field is required!',
      'email.required': 'Email field is required!',
      'email.email': 'Email field must be an email of this format youremail@example.com!',
      'email.unique': 'Email already exist!',
      'phone.required': 'Phone field is required',
      'username.required': 'The username field is require!',
      'username.unique': 'The customer with username alrealdy exist!',
      'username.min': 'The username field requires at least 3 chracters!'
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(200).json({
      message: errorMessages[0].message
    });
  }
}

module.exports = UpdateCustomer
