'use strict'

class Update {
  get rules () {
   const { id } = this.ctx.params
    
    return {
      // validation rules
      firstname: 'required|min:3',
      lastname: 'required|min:3',
      address: `required|min:5`,
      city: 'required',
      state: 'required',
      photo: 'required|file|file_ext:png,jpg,jpeg|file_size:100mb|file_types:image'
    }
  }
  get messages () {
    return {
      'firstname.required': 'Firstame field is required!',
      'lastname.required': 'Lastname field is required!',
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
    return this.ctx.response.status(422).json({
      message: errorMessages[0].message
    });
  }
}

module.exports = Update
