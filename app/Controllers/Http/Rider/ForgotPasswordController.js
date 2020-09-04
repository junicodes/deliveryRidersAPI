'use strict'

const Rider = use('App/Models/Rider')
const Database = use('Database')
const Env = use('Env')
const ForgotPasswordMail = use('App/Controllers/Http/Email/ForgotPasswordMail')

class ForgotPasswordController {
    constructor() {
        this.verifyCodeBreakOut = 0;
    }

    async forgotPassword({ request, response }) {

        const { email } = request.all()
        const forgotPasswordMail = new ForgotPasswordMail
        let note = '';

        const rider = await Rider.query().where('email', email).first();

        const trx = await Database.beginTransaction()
        try {

            if (Rider) {
                //Generate a verification code
                const verify_code = await this.createVerifyCode();

                if (this.verifyCodeBreakOut === 3) {
                    this.verifyCodebreakOut = 0
                    return response.status(501).json({ success: false, message: 'An error occured, this might be a network issue or error generating a secure details for rider, please try again' })
                }
                Rider.verify_code = verify_code
                await rider.save(trx)

                const link = `${Env.get('FRONTEND_URL')}/auth?authType=riderResetPassword&verify_code=${rider.verify_code}`
                const code = { code: rider.verify_code, link: link, note: note, sendMailTo: email }
                Object.assign(rider, code)

                //Send a Mail for verification
                const mailOut = await forgotPasswordMail.send(rider, link)
                if (!mailOut.status) {
                    return response.status(501).json({
                        status: false,
                        message: 'Please there was an error sending you a verification mail, please refresh and try again or contact support to report this issue.'
                    })
                }

                rider.code = null; //Remove the code value from the payload
                rider.link = null;
                rider.note = null;
                rider.sendMailTo = null

                trx.commit()
                return response.status(200).json({ status: true, message: 'A verification code has been send to your email account, please use to continue account verification.', rider })
            }
            return response.status(404).json({ status: false, message: 'No user found with email.' })
        } catch (error) {
            await trx.rollback()
            return response.status(501).json({ message: 'An unexpected error occured when updating your account.', hint: error.message });
        }
    }
    async createVerifyCode() {
        const verify_code = Math.floor(100000 + Math.random() * 900000);
        const checkIfExist = await Rider.findBy('verify_code', verify_code)
        if (checkIfExist) {
            if (this.verifyCodeBreakOut < 3) {
                this.verifyCodeBreakOut++;
                await this.createVerifyCode();
            }
        }
        return verify_code;
    }
}

module.exports = ForgotPasswordController
