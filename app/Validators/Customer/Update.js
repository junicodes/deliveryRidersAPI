'use strict'

class Update {
  get rules () {
   const { id } = this.ctx.params
    
    return {
      // validation rules
      firstname: 'required|min:3',
      lastname: 'required|min:3',
      phone_default: `required|string|uniqueCompound:customers,phone_default/phone_1/phone_2,${id}`,
      address: `required|min:5`,
      city: 'required',
      state: 'required',
      photo: 'required|file|file_ext:png,jpg|file_size:10mb|file_types:image'
    }
  }
  get messages () {
    return {
      'firstname.required': 'Firstame field is required!',
      'lastname.required': 'Lastname field is required!',
      'phone_default.required': 'Phone field is required',
      'phone_default.uniqueCompound': 'Phone number of this sort exist or is associated with an account.',
      'username.required': 'The username field is require!',
      'address': 'Address is needed!',
      'city': 'Your residing city is needed!',
      'state': 'Your residing state is needed',
      'photo.required': 'A profile photo is reqired',
      'photo.file_types': 'Photo must be an image file with extention (jpeg, jpg, png)',
      'photo.file_ext': 'Invalid Photo extention, accepted only (jpeg, jpg, png)',
      'photo.file_size': 'Photo size too large, please image must be less than 10mb'
    }
  }

  async fails(errorMessages) {
    console.log("f",errorMessages)
    return this.ctx.response.status(200).json({
      message: errorMessages[0].message
    });
  }
}

module.exports = Update
