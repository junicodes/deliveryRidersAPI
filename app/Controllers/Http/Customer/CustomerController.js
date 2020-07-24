'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Customer = use('App/Models/Customer')
const Database = use('Database')
const WelcomeMail = use('App/Controllers/Http/Email/WelcomeMail')
const SingleFileUploadController = use('App/Controllers/Http/FileUpload/SingleFileUploadController')
const Env = use('Env')


class CustomerController {
  
  async index ({response, params: { page }}) {

    const customers = await Customer.query().paginate(page)

    response.status(200).json({
      message: "All customers",
      data: customers
    })
    
  }
 
  async store (customer) {
    
    const trx = await Database.beginTransaction()
    const welcomeMail = new WelcomeMail 
    try {
      
      const customerInfo = await Customer.create(customer)

      const link = `${Env.get('FRONTEND_URL')}/auth?authType=confirm&verify_code=${customer.verify_code}`

      const code  = {code: customer.verify_code, link: link}  //create a temporary code value for mailing

      Object.assign(customerInfo, code) //attach a code value for mail since verify_code is inaccesble 

      const mailOut = await welcomeMail.send(customerInfo, link) //Send Welcome Mail with token

      if(!mailOut.status) {
        return response.status(501).json({status: false, 
          message: 'Please there was an error sending you a verification mail, please refresh and try again or contact support to report this issue.'})
      }

      trx.commit() //once done commit the transaction
      
      customerInfo.code = null; //Remove the code value from the payload
      customerInfo.link = null; 

      return {success: true, message: 'Successfully created a new customer.', customer: customerInfo, status: 201}
    } catch (error) {

      await trx.rollback()
      return {error: false, message: 'An unexpected error occured when creating a customer.', hint: error.message, status:501}
    }

  }

  async show ({ auth, response }) {
    const customer = auth.user
    response.status(200).json({message: "Customer found!", customer})

  }
 
  async update ({request, auth, response }) {
      
      const singleFileUpload = new SingleFileUploadController
      const customer = auth.user;
      const {firstname, lastname, phone_default, address, city, state} = request.all()
      const folder = 'customers';
      const dbFile = customer.photo;
      const trx = await Database.beginTransaction();

      try {
        customer.firstname = firstname;
        customer.lastname = lastname;
        customer.phone_default = phone_default;
        customer.address = address;
        customer.city = city;
        customer.state = state;
        
        //handle file Upload 
        const file = request.file('photo', {
            types: ['image'],
            size: '10mb',
            extnames: ['png', 'jpg', 'jpeg']
        });
        
        if(dbFile !== Env.get('DEFAULT_PHOTO')) {
          const splitDbFile = dbFile.split(Env.get('CLOUDINARY_IMAGE_URL'))
          const delRes = await singleFileUpload.handleDelete(splitDbFile[0]); //Delete an existing image from Cloudinary if in Database
          if(!delRes.status) {return response.status(res.status).json({message:'An error occured while uploading image', hint: res.image_del_info})}
        }

        const res = await singleFileUpload.handleUpload(file, folder);
        if(!res.status) {return response.status(res.status).json({message:'An error occured while uploading image', hint: res.image_up_info})}

        customer.photo = res.image_up_info.public_id //Save image to Db and generate for response
        await customer.save(trx);
        trx.commit(); //once done commit the transaction

        const photo = `${Env.get('CLOUDINARY_IMAGE_URL')}${res.image_up_info.public_id}`
        Object.assign(customer, {photo})
        
        response.status(200).json({message: 'Your Account has been updated successfully!', customer});
      } catch (error) {

        await trx.rollback()
        response.status(501).json({message: 'An unexpected error occured when updating your account.', hint:  error.message});
      }
  }

  async destroy ({auth, response }) {

    const customer = auth.user;
     try {
      await customer.delete();
      response.status(200).json({message: "Account Delete Succesfully!"});
     } catch (error) {
      response.status(501).json({message: 'An unexpected error occured when updating your account.', hint:  error.message});
     }

  }

    //   async getPosts({request, response}) {
    //     let posts = await Post.query().with('user').fetch()

    //     return response.json(posts)
    //   }

}

module.exports = CustomerController
