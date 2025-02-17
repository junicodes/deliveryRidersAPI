'use strict'

const Customer = use('App/Models/Customer')
const Database = use('Database')
const Env = use('Env')
const ForgotPasswordMail = use('App/Controllers/Http/Email/ForgotPasswordMail')

class ForgotPasswordController {

    constructor() {
        this.verifyCodeBreakOut = 0;
    }

    async forgotPassword ({request, response}) {

        const {email} = request.all()
        const forgotPasswordMail = new ForgotPasswordMail
        let note='';

        console.log(email)
        
        const customer = await Customer.query()
                .where('email_default', email).orWhere('email_1', email)
                .orWhere('email_2', email).first();
        
  
        const trx = await Database.beginTransaction()
        try {

            if(customer) { 
                if(email !== customer.email_default) {
                    note = `IMPORTANT INFORMATION: We are sending this verification mail to you,
                            because it is associated to your primary email account
                            (${customer.email_default}), please you should know that if this current email account
                            have not been permitted for login purposes, you will have to use your primary email account to login, Thank You!`;
        
                }

                //Generate a verification code
                const verify_code = await this.createVerifyCode();
                if(this.verifyCodeBreakOut === 3){
                    this.verifyCodebreakOut = 0
                    return response.status(501).json({success: false, message: 'An error occured, this might be a network issue or error generating a secure details for customer, please try again'})
                }

                customer.verify_code = verify_code
                await customer.save(trx)

                const link = `${Env.get('FRONTEND_URL')}/auth?authType=reset&verify_code=${customer.verify_code}`
                const code = {code: customer.verify_code, link: link, note: note, sendMailTo: email}
                Object.assign(customer, code)
                
                //Send a Mail for verification
                const mailOut = await forgotPasswordMail.send(customer, link)
                if(!mailOut.status) {
                    return response.status(501).json({status: false, 
                    message: 'Please there was an error sending you a verification mail, please refresh and try again or contact support to report this issue.'})
                } 
                
                customer.code = null; //Remove the code value from the payload
                customer.link = null; 
                customer.note = null;
                customer.sendMailTo = null

                trx.commit()
                return response.status(200).json({status: true, message: 'kA verification code has been send to your email account, please use to continue account verification.', customer})
            }
            return response.status(404).json({status: false, message: 'No user found with email.'})
        } catch (error) {
            await trx.rollback()
            return response.status(501).json({message: 'An unexpected error occured when updating your account.', hint:  error.message});
        }
    }
    async createVerifyCode () {
        const verify_code = Math.floor(100000 + Math.random() * 900000);
        const checkIfExist = await Customer.findBy('verify_code', verify_code)
        if(checkIfExist) {
            if(this.verifyCodeBreakOut < 3) {
                this.verifyCodeBreakOut++;
                await this.createVerifyCode(); 
            }
        }
            return verify_code;
    }
    
}

module.exports = ForgotPasswordController
