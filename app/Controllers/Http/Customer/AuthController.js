
    'use strict'

    const Customer = use('App/Models/Customer');
    const CustomerController = use('App/Controllers/Http/Customer/CustomerController')
    const Hash = use('Hash')
    const Env = use('Env')
 
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

        let res = await customerController.store(request.all()) //Transfer to Customer Controller

        switch (res.status) {
          case 201:
            return response.status(res.status).json({success: res.success, message: res.message, data: res.customer})
          case 501:
             return response.status(res.status).json({success: res.error, message: res.message, hint: res.hint})
        }
      }
      
      async login({request, auth, response}) {

        let {email, password} = request.post();
        let token = null;

          const passOne = await this.passOne(email, password, auth)
        
          if(passOne.success) {
            token = await auth.generate(passOne.customer)
            const photo =  {
              photoUrl: Env.get('CLOUDINARY_IMAGE_URL'),
              image: passOne.customer.photo
            }
            Object.assign(passOne.customer, {photo})
            Object.assign(passOne.customer, token)
            return response.status(200).json({success: true, customer: passOne.customer})
          }
          const passTwo = await this.passTwo(email, password, auth)
          if(passTwo.success) {
            token = await auth.generate(passTwo.customer)
            const photo =  {
              photoUrl: Env.get('CLOUDINARY_IMAGE_URL'),
              image: passTwo.customer.photo
            }
            Object.assign(passTwo.customer, {photo})
            Object.assign(passTwo.customer, token)
            return response.status(200).json({success: true, customer: passTwo.customer})
          }
          const passThree = await this.passThree(email, password, auth)
          if(passThree.success) {
            token = await auth.generate(passThree.customer)
            const photo =  {
              photoUrl: Env.get('CLOUDINARY_IMAGE_URL'),
              image: passThree.customer.photo
            }
            Object.assign(passThree.customer, {photo})
            Object.assign(passThree.customer, token)
            return response.status(200).json({success: true, customer: passThree.customer})
          }

          if(passTwo.no_permit || passThree.no_permit) {
            return response.status(401).json({no_permit: true, 
              message: 'Login not allowed, This email is associated with a registered email account.',
              hint: 'To use this associated email account for this process, you will have to login with the registered email account and give permission at Account Security And Settings.'
              })

          } else if (passTwo.not_verified || passThree.not_verified) {
            return response.status(401).json({no_permit: true, 
              message: 'Login not allowed, You account is not yet verified.'
              })
          } else {
            return response.status(404).json({error: true, message: 'User Not Found', hint: 'This could be an Invalid Email or Password.'})
          }

      }

      async passOne(email, password, auth) {
          try {
            if (await auth.authenticator('customerJwt1').attempt(email, password)) {
              const customer = await Customer.findBy('email_default', email)
              if(customer.account_verified_at === null) {
                return {not_verified: true, status: 401}
              }
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

              if(customer.account_verified_at === null) {
                return {not_verified: true, status: 401}
              }

              if(!customer.email_permit_1) {
                return {no_permit: true, status: 401}
              }
              return {success: true, customer, status: 200}
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
              if(customer.account_verified_at === null) {
                return {not_verified: true, status: 401}
              }

              if(!customer.email_permit_2) {
                return {no_permit: true, status: 401}
              }
              return {success: true, customer, status: 200}
            }
          } catch (e) {
            return {error: true, status: 404, hint: e.message}
          }
      }
    }

    module.exports = AuthController