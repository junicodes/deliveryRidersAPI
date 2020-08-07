'use strict'

class EmailCheck {
  get rules () {
    const { id } = this.ctx.params
    console.log(id)
     
     return {
       // validation rules
       email_default: `required|string|uniqueCompound:customers,email_default/email_1/email_2,${id}`,
     }
   }
   // email_default: `required|email|unique:customers,email_default,id,${id}`,
   get messages () {
     return {
       'email_default.required': 'Email field is required!',
       'email_default.uniqueCompound': 'Email already exist or is associated with an account!',
     }
   }
 
   async fails(errorMessages) {
     return this.ctx.response.status(422).json({
       message: errorMessages[0].message
     });
   }
}

module.exports = EmailCheck
