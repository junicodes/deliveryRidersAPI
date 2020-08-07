'use strict'

class ImageFile {
  get rules () {
    const { id } = this.ctx.params
    console.log(id)
     
     return {
       // validation rules
       file: `required|string|uniqueCompound:customers,file/email_1/email_2,${id}`,
     }
   }
   // file: `required|email|unique:customers,file,id,${id}`,
   get messages () {
     return {
       'file.required': 'Email field is required!',
       'file.uniqueCompound': 'Email already exist or is associated with an account!',
     }
   }
 
   async fails(errorMessages) {
     return this.ctx.response.status(422).json({
       message: errorMessages[0].message
     });
   }
}

module.exports = ImageFile
