'use strict'

const Admin = use('App/Models/Admin')
const Database = use('Database')
const WelcomeMail = use('App/Controllers/Http/Email/Admin/WelcomeMail')
const Env = use('Env')

class AdminController {

  async store (admin, password, verify_code) {

    console.log(admin, password, verify_code)
    const trx = await Database.beginTransaction()
    const welcomeMail = new WelcomeMail

    try {
      const adminInfo = await Admin.create(admin, trx)

      const link = `${Env.get('FRONTEND_URL')}/auth?authType=adminLogin&link_code=${verify_code}`

      const email_secrete = {pass: password, link}

      Object.assign(adminInfo, email_secrete)

      const mailOut = await welcomeMail.send(adminInfo, link)

      if (!mailOut.status) {
        return { error: false, message: 'Please there was an error sending login details to your admin email account, this could be a bad network connection, please refresh and try again or contact technical support.', hint: mailOut.hint, status: 501 }
      }

      await trx.commit()
      adminInfo.pass = null
      adminInfo.link = null

      return { success: true, message: `Hurray! Rider registration was successful, please rider should recieve an email to account (${admin.email}) to login, Thank you.`, admin: adminInfo, status: 201 }
    } catch (error) {
        await trx.rollback()
        return { error: false, message: 'An unexpected error occured when creating a rider.', hint: error.message, status: 501 }
    }
  }

  
}

module.exports = AdminController
