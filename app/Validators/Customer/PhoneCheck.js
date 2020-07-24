'use strict'

class PhoneCheck {
  get rules () {
    const { id } = this.ctx.params
    console.log(id)
     
     return {
       // validation rules
       phone_default: `required|string|uniqueCompound:customers,phone_default/phone_1/phone_2,${id}`,
     }
   }
   // phone_default: `required|phone|unique:customers,phone_default,id,${id}`,
   get messages () {
     return {
       'phone.required': 'Phone field is required!',
       'phone_default.uniqueCompound': 'Phone already exist or is associated with an account!',
     }
   }
 
   async fails(errorMessages) {
     return this.ctx.response.status(200).json({
       message: errorMessages[0].message
     });
   }
}

module.exports = PhoneCheck
