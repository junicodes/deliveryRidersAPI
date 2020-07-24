'use strict'

const Customer = use('App/Models/Customer')
const Database = use('Database')
const Env = use('Env')
const ForgotPasswordMail = use('App/Controllers/Http/Email/ForgotPasswordMail')

class ForgotPasswordController {

    async forgotPassword ({request, response}) {

        const {email} = request.all()
        const forgotPasswordMail = new ForgotPasswordMail
        let note='';

        console.log(email)
        
        const customer = await Customer.query()
                .where('email_default', email)
                .orWhere('email_1', email)
                .orWhere('email_2', email)
                .first();
        
        console.log(customer.verify_code)
        if(email !== customer.email_default) {
            note = `IMPORTANT INFORMATION: We are sending this verification mail to you,
                    because it is associated to your primary email account
                    (${customer.email_default}), please you should know that if this current email account
                    have not been permitted for login purposes, you will have to use your primary email account to login, Thank You!`;

        }


        const link = `${Env.get('FRONTEND_URL')}/auth?authType=reset&verify_code=${customer.verify_code}`

        const code = {code: customer.verify_code, link: link, note: note, sendMailTo: email}

        Object.assign(customer, code)

        if(customer) { 
            //Send a Mail for verification
            const mailOut = await forgotPasswordMail.send(customer, link)
            console.log(mailOut)
            if(!mailOut.status) {
                return response.status(501).json({status: false, 
                  message: 'Please there was an error sending you a verification mail, please refresh and try again or contact support to report this issue.'})
             }

             customer.code = null; //Remove the code value from the payload
             customer.link = null; 
             customer.note = null;
             customer.sendMailTo = null

            return response.status(200).json({status: true, message: 'A verification mail has been send to your email account to reset password', customer})
        }
         return response.status(200).json({status: false, customer})
    }
}

module.exports = ForgotPasswordController
