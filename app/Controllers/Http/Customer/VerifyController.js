'use strict'

const moment = use("moment")
const Customer = use('App/Models/Customer')
const Database = use('Database')
const Env = use('Env')

class VerifyController {

    constructor() {
        this.verifyCodeBreakOut = 0;
    }

    async verify({request, response}) {

        let {verify_code} = request.all()
        const customer = await Customer.findBy('verify_code', verify_code)

        const trx = await Database.beginTransaction()
        try {
            if(customer) {
                 //Generate a verification code
                const verify_code = await this.createVerifyCode();

                if(this.verifyCodeBreakOut === 3){
                    this.verifyCodebreakOut = 0
                    return response.status(501).json({success: false, message: 'An error occured, this might be a network issue or error generating a secure details for customer, please try again'})
                }

                customer.verify_code = verify_code
                customer.account_verified_at =  moment().format()
                await customer.save(trx)
                trx.commit()

                return response.status(200).json({success: true, message: 'Oh yea! Your account is successfully verified, please login to explore.', customer})
            }
            return response.status(404).json({error: false, message: 'Verification code has expired or does not exist'})
        } catch (error) {

            await trx.rollback()
            return response.status(501).json({error: true, message: 'An unexpected error occured when updating your account.', hint:  error.message});
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

module.exports = VerifyController
