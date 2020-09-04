'use strict'

const Rider = use('App/Models/Rider')
const Database = use('Database')
const Env = use('Env')
const Hash = use('Hash')


class ResetPasswordController {

    constructor() {
        this.verifyCodeBreakOut = 0;
    }

    async resetPassword({ request, response }) {

        let { verify_code, password } = request.all();
        console.log(password)
        const rider = await Rider.findBy('verify_code', verify_code)

        const trx = await Database.beginTransaction()
        try {
            if (rider) {
                //Generate a verification code
                const verify_code = await this.createVerifyCode();

                if (this.verifyCodeBreakOut === 3) {
                    this.verifyCodebreakOut = 0
                    return response.status(501).json({ success: false, message: 'An error occured, this might be a network issue or error generating a secure details for rider, please try again' })
                }
                rider.verify_code = verify_code
                rider.password = await Hash.make(password)
                await rider.save(trx)
                trx.commit()

                return response.status(200).json({ status: true, message: 'Your account password reset is done successful', rider })
            }
            return response.status(404).json({ status: false, message: 'Verification code has expired or does not exist' })
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

module.exports = ResetPasswordController
