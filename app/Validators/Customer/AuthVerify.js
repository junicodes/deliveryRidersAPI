'use strict'

class AuthVerify {
  get rules () {
    return {
      // validation rules
      verify_code: 'required|min:6|max:6'
    }
  }

  get messages () {
    return {
      'verify_code.required': 'The verification code field is required.',
      'verify_code.min': 'Verification code should be 6.',
      'verify_code.max': 'Verification code should be 6.'
    }
  }

  async fails (errorMessages){
    return this.ctx.response.status(422).json({
      message: errorMessages[0].message
    })
  }
}

module.exports = AuthVerify
