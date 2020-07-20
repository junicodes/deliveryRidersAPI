
    'use strict'

    const Customer = use('App/Models/Customer');
    const CustomerController = use('App/Controllers/Http/Customer/CustomerController')
    const Hash = use('Hash')
 
    class AuthController {

      async register({request, auth, response}) {

        const customerController = new CustomerController

        let {phone_default, email_default, password} = request.all() //Get Data form api

        // const check_auth = email_default.indexOf("@")//Check if the auth permit is a phone or email access
        // if(check_auth !== -1) {request.body.email = email_default} else if(!isNaN(email_default)) {request.body.phone = email_default}

        //Generate a verification code
           const moreData = {
              email_1: email_default,
              email_2: email_default,
              phone_1: phone_default,
              phone_2: phone_default,
              password: await Hash.make(password), //Hash the password
              verify_code: Math.floor(100000 + Math.random() * 900000)
            } 
            
        Object.assign(request.all(), moreData)

        let res = await customerController.store({ request }) //Transfer to Customer Controller

        switch (res.status) {
          case 201:
            let token = await auth.generate(res.customer)//generate token 

            Object.assign(res.customer, token)//Assign token to customer object

            return response.status(res.status).json({'success': res.success, message: res.message, data: res.customer})
          case 501:
             return response.status(res.status).json({'error': res.error, 'message': res.message, 'hint': res.hint})
        }
      }
      
      async login({request, auth, response}) {

        let {email, password} = request.post();
        let token = null;

          const passOne = await this.passOne(email, password, auth)
        
          if(passOne.success) {
            token = await auth.generate(passOne.customer)
            Object.assign(passOne.customer, token)
            return response.status(200).json({success: true, customer: passOne.customer})

          }
          const passTwo = await this.passTwo(email, password, auth)
          if(passTwo.success) {
            token = await auth.generate(passTwo.customer)
            Object.assign(passTwo.customer, token)
            return response.status(200).json({success: true, customer: passTwo.customer})

          }
          const passThree = await this.passThree(email, password, auth)
          if(passThree.success) {
            token = await auth.generate(passThree.customer)
            Object.assign(passThree.customer, token)
            return response.status(200).json({success: true, customer: passThree.customer})

          }

          if(passTwo.no_permit || passThree.no_permit) {
            return response.status(404).json({no_permit: true, 
              message: 'Login not allowed, This email is associated with a registered email account.',
              hint: 'To use this associated email account for this process, you will have to login with the registered email account and give permission at Account Security And Settings.'
              })

          } else {
            return response.status(404).json({error: true, message: 'Not found!'})
          }

      }

      async passOne(email, password, auth) {
          try {
            if (await auth.authenticator('customerJwt1').attempt(email, password)) {
              const customer = await Customer.findBy('email_default', email)
              return {success: true, customer, status: 200}
             }
          } catch (e) {
            return {error: true, status: 404, hint: e.message}
          }
      }
      async passTwo(email, password, auth) {
         
          try {
             //Check permission table before access
            if (await auth.authenticator('customerJwt2').attempt(email, password)) {
              const customer = await Customer.findBy('email_1', email)
              console.log(customer.email_permit_1)
              if(customer.email_permit_1) {
                return {success: true, customer, status: 200}
              }
              return {no_permit: true, status: 404}
            }
          } catch (e) {
            return {error: true, status: 404, hint: e.message}
          }
      }
      async passThree(email, password, auth) {
          try {
             //Check permission table before access
            if (await auth.authenticator('customerJwt3').attempt(email, password)) {
              const customer = await Customer.findBy('email_2', email)
              if(customer.email_permit_2) {
                return {success: true, customer, status: 200}
              }
              return {no_permit: true, status: 404}
            }
          } catch (e) {
            return {error: true, status: 404, hint: e.message}
          }
      }
    }

    module.exports = AuthController