'use strict'

const Customer = use('App/Models/Customer')
const Database = use('Database')
const Env = use('Env')
const Hash = use('Hash')


class ResetPasswordController {

    async resetPassword ({request, response}) {

        let {verify_code, password} = request.all();
        console.log(password)
        const customer = await Customer.findBy('verify_code', verify_code)

        const trx = await Database.beginTransaction()
        try {
            if(customer) {
                verify_code = Math.floor(100000 + Math.random() * 900000)
                customer.verify_code = verify_code
                customer.password = await Hash.make(password)
                await customer.save(trx)
                trx.commit()

                return response.status(200).json({status: true, message: 'Your account password reset is done successful', customer})
            }
            return response.status(404).json({status: false, message: 'Verification code has expired or does not exist'})
        } catch (error) {

            await trx.rollback()
            return response.status(501).json({message: 'An unexpected error occured when updating your account.', hint:  error.message});
        }

    }
}

module.exports = ResetPasswordController
