'use strict'

const moment = use("moment")

const Customer = use('App/Models/Customer')
const Database = use('Database')
const Env = use('Env')

class VerifyController {

    async verify({request, response}) {

        let {verify_code} = request.all()
        const customer = await Customer.findBy('verify_code', verify_code)

        const trx = await Database.beginTransaction()
        try {
            if(customer) {
                verify_code = Math.floor(100000 + Math.random() * 900000)
                customer.verify_code = verify_code
                customer.account_verified_at =  moment().format()
                await customer.save(trx)
                trx.commit()

                return response.status(200).json({status: true, message: 'Account verifcation successful', customer})
            }
            return response.status(404).json({status: false, message: 'Verification code has expired or does not exist'})
        } catch (error) {

            await trx.rollback()
            return response.status(501).json({message: 'An unexpected error occured when updating your account.', hint:  error.message});
        }
        
    }
}

module.exports = VerifyController
