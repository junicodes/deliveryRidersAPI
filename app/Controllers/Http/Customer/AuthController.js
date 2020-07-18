
    'use strict'

    const Customer = use('App/Models/Customer');
    const CustomerController = use('App/Controllers/Http/Customer/CustomerController')
    const Hash = use('Hash')
    const Mail = use('Mail')


    class AuthController {
0
      async register({request, auth, response}) {

        const customerController = new CustomerController

        let {firstname, lastname, email_default, password} = request.post() //Get Data form api

        // const check_auth = email_default.indexOf("@")//Check if the auth permit is a phone or email access
        // if(check_auth !== -1) {request.body.email = email_default} else if(!isNaN(email_default)) {request.body.phone = email_default}

        request.post().password = await Hash.make(password) //Hash the password

        let res = await customerController.store({ request }) //Transfer to Customer Controller

        //Send Mail

        let token = await auth.generate(res.customer)//generate token after database storing

        Object.assign(res.customer, token)//Assign token to customer object

        return response.status(res.status).json({'message': res.message, data: res.customer})

      }

      async login({request, auth, response}) {

        let {email_default, password} = request.post();

        try {
          if (await auth.authenticator('customerJwt').attempt(email_default, password)) {
            let customer = await Customer.findBy('email_default', email_default)
            let token = await auth.generate(customer)

            Object.assign(customer, token)
            return response.status(501).json(customer)
          }
        } catch (e) {
          console.log(e)
          return response.status(501).json({message: 'You are not registered!', hint: e.message})
        }
      }
      
    //   async getPosts({request, response}) {
    //     let posts = await Post.query().with('user').fetch()

    //     return response.json(posts)
    //   }

    }

    module.exports = AuthController