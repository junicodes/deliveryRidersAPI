'use strict'

const Admin = use('App/Models/Admin')
const Database = use('Database')
const Env = use('Env')
const ResendVerifyCodeMail = use('App/Controllers/Http/Email/ResendVerifyCodeMail')

class ResendVerifyCodeControlller {

    constructor() {
        this.verifyCodeBreakOut = 0;
    }

    async resendCode ({request, response}) {

        const {email} = request.post()
        const resendVerifyCodeMail = new ResendVerifyCodeMail
        let note='';
    
        const admin = await Admin.query().where('email', email).first();

        const trx = await Database.beginTransaction()
        try {

            if(admin) { 
                //Generate a verification code
                const verify_code = await this.createVerifyCode();

                if (this.verifyCodeBreakOut === 3) {
                    this.verifyCodebreakOut = 0
                    return response.status(501).json({ success: false, message: 'An error occured, this might be a network issue or error generating a secure details for admin, please try again' })
                }
                admin.verify_code = verify_code
                await admin.save(trx)

                const link = `${Env.get('FRONTEND_URL')}/auth?authType=adminLogin&link_code=${admin.verify_code}`
                const code = {code: admin.verify_code, link, note, sendMailTo: email}
                Object.assign(admin, code)
                
                //Send a Mail for verification
                const mailOut = await resendVerifyCodeMail.send(admin, link)
                if(!mailOut.status) {
                    return response.status(501).json({status: false, 
                    message: 'Please there was an error sending you a verification mail, please refresh and try again or contact support to report this issue.'})
                } 
                
                admin.code = null; admin.link = null; admin.note = null; admin.sendMailTo = null
                trx.commit()
               
                return response.status(200).json({status: true, message: 'A verification code has been send to your email account, please use to continue account verification.', admin})
            }
            return response.status(404).json({status: false, message: 'No user found with email.'})
        } catch (error) {
            await trx.rollback()
            return response.status(501).json({message: 'An unexpected error occured when updating your account.', hint:  error.message});
        }
    }
    async createVerifyCode () {
        const verify_code = Math.floor(100000 + Math.random() * 900000);
        const checkIfExist = await Admin.findBy('verify_code', verify_code)
        if(checkIfExist) {
            if(this.verifyCodeBreakOut < 3) {
                this.verifyCodeBreakOut++;
                await this.createVerifyCode(); 
            }
        }
        return verify_code;
    }
}

module.exports = ResendVerifyCodeControlller
