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
      
      const customerInfo = await Customer.create(customer, trx)

      const link = `${Env.get('FRONTEND_URL')}/auth?authType=confirm&verify_code=${customer.verify_code}`

      const code  = {code: customer.verify_code, link: link}  //create a temporary code value for mailing

      Object.assign(customerInfo, code) //attach a code value for mail since verify_code is inaccesble 

      const mailOut = await welcomeMail.send(customerInfo, link) //Send Welcome Mail with token

      if(!mailOut.status) {
          return {error: false, message: 'Please there was an error sending you a verification mail, this could be a bad network connection, please refresh and try again or contact support to report this issue.', hint: mailOut.hint, status:501}
      }

      trx.commit() //once done commit the transaction
      
      customerInfo.code = null; //Remove the code value from the payload
      customerInfo.link = null; 

      return {success: true, message: `Hurray! Your registration was successful, please go to (${customer.email_default}) confirm, Thank you.`, customer: customerInfo, status: 201}
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
      const {firstname, lastname, address, city, state} = request.all()
      const folder = 'customers';
      const dbFile = customer.photo;
      const trx = await Database.beginTransaction();

      try {
        customer.firstname = firstname;
        customer.lastname = lastname;
        customer.address = address;
        customer.city = city;
        customer.state = state;

        //handle file Upload 
        if(request.file('photo').clientName !== '@cdr-faker-file-349089-ignore.png'){
          const file = request.file('photo', {
              types: ['image'],
              size: '100mb',
              extnames: ['png', 'jpg', 'jpeg']
          });
          
          if(dbFile !== Env.get('DEFAULT_PHOTO')) {
            const delRes = await singleFileUpload.handleDelete(dbFile); //Delete an existing image from Cloudinary if in Database
            console.log(delRes.status)
            if(!delRes.status) {return response.status(delRes.status_code).json({ message:'An error occured while uploading image', hint: delRes.image_del_info})}
          }

          const res = await singleFileUpload.handleUpload(file, folder);
          if(!res.status) {return response.status(res.status_code).json({message:'An error occured while uploading image', hint: res.image_up_info})}
          customer.photo = `${res.image_up_info.public_id}.${res.image_up_info.format}` //Save image to Db and generate for response
        }      
        await customer.save(trx);
        trx.commit(); //once done commit the transaction

        const photo =  {
          photoUrl: Env.get('CLOUDINARY_IMAGE_URL'),
          image: customer.photo
        }
        Object.assign(customer, {photo})
        
        response.status(200).json({status: true, message: 'Your Account has been updated successfully!', customer});
      } catch (error) {

        await trx.rollback()
        response.status(501).json({status: false, message: 'An unexpected error occured when updating your account.', hint:  error.message});
      }
  }

  async destroy ({auth, response }) {

    const customer = auth.user;
     try {
      await customer.delete();
      response.status(200).json({status: true, message: "Account Delete Succesfully!"});
     } catch (error) {
      response.status(501).json({status: false, message: 'An unexpected error occured when updating your account.', hint:  error.message});
     }

  }

    //   async getPosts({request, response}) {
    //     let posts = await Post.query().with('user').fetch()

    //     return response.json(posts)
    //   }

}

module.exports = CustomerController
