
'use strict'

class EmailCheck {
  get rules () {
     
     return {
       // validation rules
       email: `required|email`,
     }
   }
   
   get messages () {
     return {
       'email.required': 'Email field is required!',
       'email.email': 'Please use a valid email account.!',
     }
   }
 
   async fails(errorMessages) {
     return this.ctx.response.status(422).json({
       message: errorMessages[0].message
     });
   }
}

module.exports = EmailCheck
